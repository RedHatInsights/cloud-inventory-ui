import { atom } from 'jotai';
import { renderHookWithRouter } from '../../../utils/testing/customRender';
import { generateQueryParamsForData } from '../useQueryParam';
import {
  useQueryParamInformedAtom,
  useQueryParamInformedState,
} from '../useQueryParam';
import { useEffect } from 'react';
import { waitFor } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),

  useLocation: () => ({
    pathname: '/',
    search: `?${mockURLSearchParams?.toString?.() ?? ''}`,
    hash: '',
    state: null,
    key: 'test',
  }),

  useSearchParams: (init?: URLSearchParams) => {
    if (init) {
      mockURLSearchParams = new URLSearchParams(init);
    }

    const snapshot = new URLSearchParams(mockURLSearchParams);

    type SetSearchParamsArg =
      | URLSearchParams
      | ((prev: URLSearchParams) => URLSearchParams);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setSearchParams = (next: SetSearchParamsArg, ..._args: unknown[]) => {
      mockURLSearchParams =
        typeof next === 'function' ? next(mockURLSearchParams) : next;
    };

    return [snapshot, setSearchParams] as const;
  },
}));

let mockURLSearchParams: URLSearchParams;

const flushMicrotasks = () =>
  new Promise<void>((resolve) => queueMicrotask(() => resolve()));

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

  it('does not override params when multiple query setters run back-to-back', async () => {
    mockURLSearchParams = new URLSearchParams({ preExisting: 'value' });

    const aAtom = atom<number>(0);
    const bAtom = atom<number>(0);

    renderHookWithRouter(() => {
      const [, setA] = useQueryParamInformedAtom(aAtom, 'a');
      const [, setB] = useQueryParamInformedAtom(bAtom, 'b');

      useEffect(() => {
        setA(1);
        setB(2);
      }, []);

      return null;
    });

    await waitFor(() => {
      expect(mockURLSearchParams.get('a')).toBe('1');
      expect(mockURLSearchParams.get('b')).toBe('2');
    });

    expect(mockURLSearchParams.get('preExisting')).toBe('value');
  });

  it('updates the search query when atom is updated', async () => {
    const customAtom = atom<number>(1);
    expect(mockURLSearchParams.get('num')).toBeNull();

    const { result } = renderHookWithRouter(() => {
      const [a, setA] = useQueryParamInformedAtom(customAtom, 'num');

      useEffect(() => {
        setA(2);
      }, []);

      return [a, setA] as const;
    });

    expect(result.current[0]).toBe(2);

    await flushMicrotasks();
    expect(mockURLSearchParams.get('num')).toBe('2');
  });
  it('updates the search query when state is updated', async () => {
    expect(mockURLSearchParams.get('num')).toBeNull();

    const { result } = renderHookWithRouter(() => {
      const [a, setA] = useQueryParamInformedState(1, 'num');

      useEffect(() => {
        setA(2);
      }, []);

      return [a, setA] as const;
    });

    expect(result.current[0]).toBe(2);

    await flushMicrotasks();
    expect(mockURLSearchParams.get('num')).toBe('2');
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

      return [
        [state, setState],
        [atomVal, setAtomVal],
      ] as const;
    });

    expect(result.current[0][0]).toBe(2);
    expect(result.current[1][0]).toBe(2);

    await flushMicrotasks();

    expect(mockURLSearchParams.get('customState')).toBe('2');
    expect(mockURLSearchParams.get('customAtom')).toBe('2');
    expect(mockURLSearchParams.get('preExisting')).toEqual('value');
  });

  describe('generateQueryParamsForData', () => {
    it('creates URLSearchParams with JSON value', () => {
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
  it('handles strings correctly', () => {
    const data = 'hello world';
    const key = 'str';

    const params = generateQueryParamsForData(data, key);

    expect(params.get(key)).toBe(JSON.stringify('hello world'));
  });
});
