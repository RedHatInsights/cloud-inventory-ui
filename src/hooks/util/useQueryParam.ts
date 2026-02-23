import { PrimitiveAtom, useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type QueryParamBatchRef = React.MutableRefObject<{
  nextParams: URLSearchParams | null;
  updatePlanned: boolean;
}>;

export function useQueryParamBatchRef(): QueryParamBatchRef {
  return useRef({ nextParams: null, updatePlanned: false });
}

function updateQueryParamsTogether(
  batchRef: QueryParamBatchRef,
  currentParams: URLSearchParams,
  applyUpdate: (p: URLSearchParams) => void,
  commit: (p: URLSearchParams) => void,
) {
  const base = batchRef.current.nextParams
    ? new URLSearchParams(batchRef.current.nextParams.toString())
    : new URLSearchParams(currentParams.toString());
  applyUpdate(base);
  batchRef.current.nextParams = base;
  if (batchRef.current.updatePlanned) return;
  batchRef.current.updatePlanned = true;
  queueMicrotask(() => {
    batchRef.current.updatePlanned = false;
    const toCommit = batchRef.current.nextParams;
    batchRef.current.nextParams = null;
    if (toCommit) commit(toCommit);
  });
}

function useInitializeFromQueryParam<T>(key: string, setter: (v: T) => void) {
  const [searchParams] = useSearchParams();
  const init = searchParams.get(key);
  useEffect(() => {
    if (init != null) {
      try {
        setter(JSON.parse(init) as T);
      } catch {
        console.error(`Failed to parse search param ${key}`);
      }
    }
  }, [init, key, setter]);
}

export function generateQueryParamsForData<T>(data: T, key: string) {
  const params = new URLSearchParams();
  params.set(key, JSON.stringify(data));
  return params;
}

function useUpdateQueryParams<T>(
  key: string,
  setter: (v: T) => void,
  batchRef?: QueryParamBatchRef,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const commit = useCallback(
    (p: URLSearchParams) => setSearchParams(p, { replace: true }),
    [setSearchParams],
  );

  const localRef = useRef<{
    nextParams: URLSearchParams | null;
    updatePlanned: boolean;
  }>({
    nextParams: null,
    updatePlanned: false,
  });
  const refToUse = batchRef ?? localRef;
  return (v: T) => {
    updateQueryParamsTogether(
      refToUse,
      searchParams,
      (p) => p.set(key, JSON.stringify(v)),
      commit,
    );
    setter(v);
  };
}

export function useQueryParamInformedAtom<T>(
  atom: PrimitiveAtom<T>,
  key: string,
  batchRef?: QueryParamBatchRef,
): [Awaited<T>, (v: T) => void] {
  const [atomValue, setAtom] = useAtom(atom);
  useInitializeFromQueryParam(key, setAtom);
  const queryParamWrappedSetter = useUpdateQueryParams(key, setAtom, batchRef);
  return [atomValue, queryParamWrappedSetter];
}

export function useQueryParamInformedState<T>(
  init: T,
  key: string,
  batchRef?: QueryParamBatchRef,
): [T, (v: T) => void] {
  const [state, setState] = useState(init);
  useInitializeFromQueryParam(key, setState);
  const queryParamWrappedSetter = useUpdateQueryParams(key, setState, batchRef);
  return [state, queryParamWrappedSetter];
}
