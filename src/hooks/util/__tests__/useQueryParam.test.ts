import { atom } from 'jotai';
import { renderHookWithRouter } from '../../../utils/testing/customRender';
import {
  useQueryParamInformedAtom,
  useQueryParamInformedState,
} from '../useQueryParam';
import { useEffect, useState } from 'react';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useSearchParams: (init: URLSearchParams) => {
    if (init) return useState(init);
    return useState(mockURLSearchParams);
  },
}));

let mockURLSearchParams: URLSearchParams;

describe('query param informed hook', () => {
  afterEach(() => {
    mockURLSearchParams = new URLSearchParams();
  });

  it('initialized atoms if present', async () => {
    const customAtom = atom<number>(1);
    mockURLSearchParams = new URLSearchParams({ num: '2' });

    const { result } = renderHookWithRouter(() =>
      useQueryParamInformedAtom(customAtom, 'num')
    );

    expect(result.current[0]).toEqual(2);
  });

  it('initializes state if present', () => {
    mockURLSearchParams = new URLSearchParams({ str: '"test"' });

    const { result } = renderHookWithRouter(() =>
      useQueryParamInformedState('', 'str')
    );

    expect(result.current[0]).toEqual('test');
  });

  it('uses default if no search is present', () => {
    const customAtom = atom<string>('defaultAtom');
    const { result: stateResult } = renderHookWithRouter(() =>
      useQueryParamInformedState('defaultState', 'str')
    );

    const { result: atomResult } = renderHookWithRouter(() =>
      useQueryParamInformedAtom(customAtom, 'num')
    );

    expect(stateResult.current[0]).toEqual('defaultState');
    expect(atomResult.current[0]).toEqual('defaultAtom');
  });

  it('updates the search query when atom is updated', () => {
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
    expect(mockURLSearchParams.get('num')).toBe('2');
  });

  it('updates the search query when state is updated', () => {
    expect(mockURLSearchParams.get('num')).toBeNull();

    const { result } = renderHookWithRouter(() => {
      const [a, setA] = useQueryParamInformedState(1, 'num');

      useEffect(() => {
        setA(2);
      }, []);

      return [a, setA];
    });

    expect(result.current[0]).toBe(2);
    expect(mockURLSearchParams.get('num')).toBe('2');
  });

  it('preserves other search params', () => {
    mockURLSearchParams = new URLSearchParams({ preExisting: 'value' });

    const customAtom = atom<number>(1);
    expect(mockURLSearchParams.get('customAtom')).toBeNull();
    expect(mockURLSearchParams.get('customState')).toBeNull();
    expect(mockURLSearchParams.get('preExisting')).toEqual('value');

    const { result } = renderHookWithRouter(() => {
      const [state, setState] = useQueryParamInformedState(1, 'customState');
      const [atom, setAtom] = useQueryParamInformedAtom(
        customAtom,
        'customAtom'
      );

      useEffect(() => {
        setState(2);
        setAtom(2);
      }, []);

      return [
        [state, setState],
        [atom, setAtom],
      ];
    });

    expect(result.current[0][0]).toBe(2);
    expect(result.current[1][0]).toBe(2);
    expect(mockURLSearchParams.get('customState')).toBe('2');
    expect(mockURLSearchParams.get('customAtom')).toBe('2');
    expect(mockURLSearchParams.get('preExisting')).toEqual('value');
  });
});
