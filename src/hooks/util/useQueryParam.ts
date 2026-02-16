import { PrimitiveAtom, useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

let nextParams: URLSearchParams | null = null;
let updatePlanned = false;

function updateQueryParamsTogether(
  currentSearch: string,
  applyUpdate: (p: URLSearchParams) => void,
  commitSearchParams: (p: URLSearchParams) => void,
) {
  const base = nextParams
    ? new URLSearchParams(nextParams)
    : new URLSearchParams(currentSearch);
  applyUpdate(base);

  nextParams = base;
  if (updatePlanned) return;
  updatePlanned = true;
  // Multiple query-param setters can run int he same tick (ex: sortBy + sortDir).
  // We merge them and write to the URL once and will prevent overwrites.
  queueMicrotask(() => {
    updatePlanned = false;
    const toCommit = nextParams;
    nextParams = null;
    if (toCommit) commitSearchParams(toCommit);
  });
}

function useInitializeFromQueryParam<T>(key: string, setter: (v: T) => void) {
  const [searchParams] = useSearchParams();
  const init = searchParams.get(key);

  useEffect(() => {
    if (init != null) {
      // If we fail to parse the search, ignore it
      try {
        setter(JSON.parse(init) as T);
      } catch {
        console.error(`Failed to parse search param ${key}`);
      }
    }
  }, [init, key, setter]);
}

export function generateQueryParamsForData<T>(
  data: T,
  key: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(key, JSON.stringify(data));
  return params;
}

function useUpdateQueryParams<T>(
  key: string,
  setter: (v: T) => void,
): (v: T) => void {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const commit = useCallback(
    (p: URLSearchParams) => setSearchParams(p, { replace: true }),
    [setSearchParams],
  );

  return (v: T) => {
    updateQueryParamsTogether(
      location.search,
      (p) => {
        p.set(key, JSON.stringify(v));
      },
      commit,
    );

    setter(v);
  };
}

export function useQueryParamInformedAtom<T>(
  atom: PrimitiveAtom<T>,
  key: string,
): [Awaited<T>, (v: T) => void] {
  const [atomValue, setAtom] = useAtom(atom);

  useInitializeFromQueryParam(key, setAtom);
  const queryParamWrappedSetter = useUpdateQueryParams(key, setAtom);

  return [atomValue, queryParamWrappedSetter];
}

export function useQueryParamInformedState<T>(
  init: T,
  key: string,
): [T, (v: T) => void] {
  const [state, setState] = useState(init);

  useInitializeFromQueryParam(key, setState);
  const queryParamWrappedSetter = useUpdateQueryParams(key, setState);

  return [state, queryParamWrappedSetter];
}
