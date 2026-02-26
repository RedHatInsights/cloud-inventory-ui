import { atom } from 'jotai';
import { renderHookWithRouter } from '../../../utils/testing/customRender';
import { generateQueryParamsForData } from '../useQueryParam';
import {
  useQueryParamInformedAtom,
  useQueryParamInformedState,
} from '../useQueryParam';
import { useEffect } from 'react';
import { waitFor } from '@testing-library/react';
import { __resetQueryParamBatchforTests } from '../useQueryParam';

let mockURLSearchParams = new URLSearchParams();

beforeEach(() => {
  mockURLSearchParams = new URLSearchParams();
  __resetQueryParamBatchforTests();
});

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),

  useSearchParams: (init?: URLSearchParams) => {
    if (init) {
      mockURLSearchParams = new URLSearchParams(init.toString());
    }

    const snapshot = new URLSearchParams(mockURLSearchParams.toString());

    type SetSearchParamsArg =
      | URLSearchParams
      | ((prev: URLSearchParams) => URLSearchParams);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setSearchParams = (next: SetSearchParamsArg, ..._args: unknown[]) => {
      const resolved =
        typeof next === 'function' ? next(mockURLSearchParams) : next;

      mockURLSearchParams = new URLSearchParams(resolved.toString());
    };

    return [snapshot, setSearchParams] as const;
  },
}));

describe('query param informed hook', () => {
  afterEach(() => {
    mockURLSearchParams = new URLSearchParams();
  });

  it('initialized atoms if present', async () => {
    const customAtom = atom<number>(1);
    mockURLSearchParams = new URLSearchParams({ num: '2' });

    const { result } = renderHookWithRouter(() =>
      useQueryParamInformedAtom(customAtom, 'num'),
    );

    expect(result.current[0]).toEqual(2);
  });

  it('initializes state if present', () => {
    mockURLSearchParams = new URLSearchParams({ str: '"test"' });

    const { result } = renderHookWithRouter(() =>
      useQueryParamInformedState('', 'str'),
    );

    expect(result.current[0]).toEqual('test');
  });

  it('uses default if no search is present', () => {
    const customAtom = atom<string>('defaultAtom');
    const { result: stateResult } = renderHookWithRouter(() =>
      useQueryParamInformedState('defaultState', 'str'),
    );

    const { result: atomResult } = renderHookWithRouter(() =>
      useQueryParamInformedAtom(customAtom, 'num'),
    );

    expect(stateResult.current[0]).toEqual('defaultState');
    expect(atomResult.current[0]).toEqual('defaultAtom');
  });

  it('updates the search query when atom is updated', async () => {
    const customAtom = atom<number>(1);
    expect(mockURLSearchParams.get('num')).toBeNull();

    const { result } = renderHookWithRouter(() => {
      const [a, setA] = useQueryParamInformedAtom(customAtom, 'num');

      useEffect(() => {
        setA(2);
      }, []);

      return [a, setA];
    });

    expect(result.current[0]).toBe(2);

    await waitFor(() => {
      expect(mockURLSearchParams.get('num')).toBe('2');
    });
  });

  it('updates the search query when state is updated', async () => {
    expect(mockURLSearchParams.get('num')).toBeNull();

    const { result } = renderHookWithRouter(() => {
      const [a, setA] = useQueryParamInformedState(1, 'num');

      useEffect(() => {
        setA(2);
      }, []);

      return [a, setA];
    });

    expect(result.current[0]).toBe(2);
    await waitFor(() => {
      expect(mockURLSearchParams.get('num')).toBe('2');
    });
  });

  it('preserves other search params', async () => {
    mockURLSearchParams = new URLSearchParams({ preExisting: 'value' });
    const customAtom = atom<number>(1);

    const { result } = renderHookWithRouter(() => {
      const [state, setState] = useQueryParamInformedState(1, 'customState');
      const [atomVal, setAtomVal] = useQueryParamInformedAtom(
        customAtom,
        'customAtom',
      );

      useEffect(() => {
        setState(2);
        setAtomVal(2);
      }, []);

      return { state, atomVal };
    });

    expect(result.current.state).toBe(2);
    expect(result.current.atomVal).toBe(2);

    await waitFor(() => {
      expect(mockURLSearchParams.get('customState')).toBe('2');
      expect(mockURLSearchParams.get('customAtom')).toBe('2');
      expect(mockURLSearchParams.get('preExisting')).toBe('value');
    });
  });

  describe('generateQueryParamsForData', () => {
    it('creates URLSearchParams with encoded JSON value', () => {
      const data = { foo: 'bar', count: 2 };
      const key = 'testKey';

      const params = generateQueryParamsForData(data, key);

      expect(params).toBeInstanceOf(URLSearchParams);
      expect(params.get(key)).toBe(JSON.stringify(data));
    });

    it('handles strings correctly', () => {
      const data = 'hello world';
      const key = 'str';

      const params = generateQueryParamsForData(data, key);

      expect(params.get(key)).toBe(JSON.stringify('hello world'));
    });
  });
});
