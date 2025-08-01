import { renderHook, waitFor } from '@testing-library/react';
import { useTableSort } from '../useTableSort';
import { IExtraColumnData, SortByDirection } from '@patternfly/react-table';
import { MouseEvent, act } from 'react';
import { expectToThrow } from '../../../../utils/testing/expectToThrow';

describe('Table sort hook', () => {
  it("doesn't sort initially", async () => {
    const initialData = [{ test: 2 }, { test: 1 }, { test: 3 }];
    const { result } = renderHook(() => useTableSort(initialData));

    (await waitFor(() => expect(result.current.sorted))).toStrictEqual(
      initialData
    );
  });

  it('can sort numbers', async () => {
    const initialData = [{ test: 2 }, { test: 1 }, { test: 3 }];
    const sortedData = initialData.sort((a, b) => (a.test < b.test ? 1 : 0));
    const { result } = renderHook(() => useTableSort(initialData));

    if (result.current.getSortParams(0).onSort == undefined) {
      throw new Error('onSort not defined');
    }

    act(() =>
      result.current
        .getSortParams(0)
        .onSort?.(
          null as unknown as MouseEvent,
          0,
          SortByDirection.asc,
          null as unknown as IExtraColumnData
        )
    );

    (await waitFor(() => expect(result.current.sorted))).toStrictEqual(
      sortedData
    );
  });

  it('sorts by default when asked', async () => {
    const initialData = [{ test: 2 }, { test: 1 }, { test: 3 }];
    const sortedData = initialData.sort((a, b) => (a.test < b.test ? 1 : 0));
    const { result } = renderHook(() =>
      useTableSort(initialData, {
        initialSort: { dir: SortByDirection.asc, index: 0 },
      })
    );

    (await waitFor(() => expect(result.current.sorted))).toStrictEqual(
      sortedData
    );
  });

  it('can sort strings', async () => {
    const initialData = [{ test: 'b' }, { test: 'a' }, { test: 'z' }];
    const sortedData = initialData.sort((a, b) => a.test.localeCompare(b.test));
    const { result } = renderHook(() =>
      useTableSort(initialData, {
        initialSort: { dir: SortByDirection.asc, index: 0 },
      })
    );

    (await waitFor(() => expect(result.current.sorted))).toStrictEqual(
      sortedData
    );
  });

  it('throws error on unsupported types', async () => {
    const initialData = [{ test: {} }, { test: 1 }, { test: 'z' }];
    expectToThrow(async () =>
      renderHook(() =>
        useTableSort(initialData, {
          initialSort: { dir: SortByDirection.asc, index: 0 },
        })
      )
    ).rejects.toThrow(/Unsupported type/);
  });

  it('throws error on mismatched types', async () => {
    const initialData = [{ test: 'a' }, { test: 1 }, { test: 'z' }];
    expectToThrow(async () =>
      renderHook(() =>
        useTableSort(initialData, {
          initialSort: { dir: SortByDirection.asc, index: 0 },
        })
      )
    ).rejects.toThrow(/Invalid comparison/);
  });
});
