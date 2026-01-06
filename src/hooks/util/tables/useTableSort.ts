import { SortByDirection } from '@patternfly/react-table';
import { ThSortType } from '@patternfly/react-table/dist/esm/components/Table/base/types';
import { MouseEvent, useEffect } from 'react';
import { useQueryParamInformedState } from '../useQueryParam';

type Sortable<T extends { [s: string]: unknown }> = Array<T>;

interface TableSortResult<T extends { [s: string]: unknown }> {
  sorted: Sortable<T>;
  getSortParams: (index: number) => ThSortType;
}

class InvalidSortTypeError extends Error {}

type SortableRowTranslator<T> = (o: T) => (string | number)[];

type SortFunc<T extends { [s: string]: unknown }> = (
  data: Sortable<T>,
  sortDirection: SortByDirection | undefined,
  sortIndex: number | undefined,
  rowTranslator: SortableRowTranslator<T>
) => Sortable<T>;

interface InitialSortOptions {
  dir: SortByDirection;
  index: number;
}

interface TableSortOptions<T extends { [s: string]: unknown }> {
  rowTranslator?: SortableRowTranslator<T>;
  sortFunc?: SortFunc<T>;
  initialSort?: InitialSortOptions;
}

interface ApiBasedTableSortOptions {
  initialSort?: InitialSortOptions;
  sortBy?: string;
  sortDir?: SortByDirection;
  setSortDir: (dir: SortByDirection) => void;
  setSortBy: (by: string) => void;
  lookup: Record<number, string>;
}

interface ApiBasedTableSortResult {
  getSortParams: (index: number) => ThSortType;
}

function defaultSortableRowTranslator<T extends { [s: string]: unknown }>(
  o: T
) {
  const rows: (string | number)[] = [];

  Object.entries(o).forEach(([k, v]) => {
    if (typeof v === 'string' || typeof v === 'number') {
      rows.push(v);
    } else {
      throw new InvalidSortTypeError(
        `Unsupported type for key ${k}. Got type ${typeof v}, expected string or number`
      );
    }
  });

  return rows;
}

function defaultSort<T extends { [s: string]: unknown }>(
  data: Sortable<T>,
  sortDirection: SortByDirection | undefined,
  sortIndex: number | undefined,
  rowTranslator: SortableRowTranslator<T>
) {
  if (sortIndex === undefined || sortDirection === undefined) {
    return data;
  }

  return data.sort((a, b) => {
    const aValue = rowTranslator(a)[sortIndex];
    const bValue = rowTranslator(b)[sortIndex];

    if (typeof aValue == 'string' && typeof bValue == 'string') {
      if (sortDirection === SortByDirection.asc) {
        return aValue.localeCompare(bValue);
      }

      return bValue.localeCompare(aValue);
    } else if (typeof aValue == 'number' && typeof bValue == 'number') {
      if (sortDirection === SortByDirection.asc) {
        return aValue - bValue;
      }

      return bValue - aValue;
    }

    throw new InvalidSortTypeError(
      `Invalid comparison between ${typeof aValue} and ${typeof bValue}`
    );
  });
}

/**
 * useTableSort manages state and functionality for Patternfly tables, and return the data sorted
 * as specified, and the sort params to pass into the table itself
 *
 * @param data Sortable<T> the data to be sorted
 * @param options TableSortOptions<T> options to specify for the sort
 *    * rowTranslator? SortableRowTranslator<T> logic to transfor any sortable object into the displayed table rows
 *    * initialSort? InitialSortOptions specify whether or not to sort initally, and how
 *    * sortFunc? SortFunc<T> override the default sort function with a custom one
 * @returns sorted Sortable<T>
 */
export function useTableSort<T extends { [s: string]: unknown }>(
  data: Sortable<T>,
  key: string,
  {
    rowTranslator = defaultSortableRowTranslator<T>,
    initialSort = undefined,
    sortFunc = defaultSort,
  }: TableSortOptions<T> = {}
): TableSortResult<T> {
  const [activeSortIndex, setActiveSortIndex] = useQueryParamInformedState<
    number | undefined
  >(initialSort?.index, `${key}ActiveSortIndex`);
  const [activeSortDirection, setActiveSortDirection] =
    useQueryParamInformedState<SortByDirection | undefined>(
      initialSort?.dir,
      `${key}ActiveSortDir`
    );

  const getSortParams = (index: number) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: SortByDirection.asc,
    },
    onSort: (_event: MouseEvent, index: number, direction: SortByDirection) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex: index,
  });

  return {
    sorted: sortFunc(data, activeSortDirection, activeSortIndex, rowTranslator),
    getSortParams,
  };
}

/**
 * useApiBasedTableSort manages state and functionality for Patternfly tables,
 * and triggers relevant sort state updated and returns the sort params to pass
 * into the table itself.
 *
 * @param key string the keys to preface query param state with
 * @param options ApiTableSortOptions options to specify for the sort
 *    * initialSort? InitialSortOptions specify whether or not to sort initally, and how
 *    * sortBy string|undefined the param to sort data by
 *    * sortDir SortByDirection|undefined the direction to sort by
 *    * setSortBy (string) => void the setter for the sort parameter
 *    * setSortDir (SortByDirection) => void the setter for the sort direction
 * @returns ApiBasedTableSortResult the getSortParams function to be used in the table column headers
 */
export function useApiBasedTableSort(
  key: string,
  {
    initialSort = undefined,
    sortBy,
    sortDir,
    setSortBy,
    setSortDir,
    lookup,
  }: ApiBasedTableSortOptions
): ApiBasedTableSortResult {
  const [activeSortIndex, setActiveSortIndex] = useQueryParamInformedState<
    number | undefined
  >(initialSort?.index, `${key}ActiveSortIndex`);
  const [activeSortDirection, setActiveSortDirection] =
    useQueryParamInformedState<SortByDirection | undefined>(
      initialSort?.dir,
      `${key}ActiveSortDir`
    );

  useEffect(() => {
    const i = Object.keys(lookup).find(
      (key) => lookup[parseInt(key)] == sortBy
    );
    setActiveSortIndex(i ? parseInt(i) : undefined);
    setActiveSortDirection(sortDir);
  }, [sortBy, sortDir]);

  const getSortParams = (index: number) => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: SortByDirection.asc,
    },
    onSort: (_event: MouseEvent, index: number, direction: SortByDirection) => {
      setSortBy(lookup[index]);
      setSortDir(direction);
    },
    columnIndex: index,
  });

  return {
    getSortParams,
  };
}
