import { PrimitiveAtom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function useInitializeFromQueryParam<T>(key: string, setter: (v: T) => void) {
  const [searchParams] = useSearchParams();
  const init = searchParams.get(key);

  useEffect(() => {
    if (init != undefined) {
      setter(JSON.parse(decodeURI(init)));
    }
  }, []);
}

function useUpdateQueryParams<T>(
  key: string,
  setter: (v: T) => void
): (v: T) => void {
  const [searchParams, setSearchParams] = useSearchParams();
  return function (v: T) {
    searchParams.set(key, encodeURI(JSON.stringify(v)));
    setSearchParams(searchParams);
    setter(v);
  };
}

export function useQueryParamInformedAtom<T>(
  atom: PrimitiveAtom<T>,
  key: string
): [Awaited<T>, (v: T) => void] {
  const [atomValue, setAtom] = useAtom(atom);

  useInitializeFromQueryParam(key, setAtom);
  const queryParamWrappedSetter = useUpdateQueryParams(key, setAtom);

  return [atomValue, queryParamWrappedSetter];
}

export function useQueryParamInformedState<T>(
  init: T,
  key: string
): [T, (v: T) => void] {
  const [state, setState] = useState(init);

  useInitializeFromQueryParam(key, setState);
  const queryParamWrappedSetter = useUpdateQueryParams(key, setState);

  return [state, queryParamWrappedSetter];
}
