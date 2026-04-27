import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import {
  CloudAccountsPaginationData,
  cloudAccountIDFilterData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../state/cloudAccounts';

export const useClearCloudAccountFilters = () => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    CloudAccountsPaginationData,
    'pagination',
  );
  const [, setProviders] = useQueryParamInformedAtom(
    cloudProviderFilterData,
    'shortName',
  );
  const [, setStatuses] = useQueryParamInformedAtom(
    goldImageStatusFilterData,
    'goldImageAccess',
  );
  const [, setAccountID] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );

  return () => {
    setProviders([]);
    setStatuses([]);
    setAccountID('');
    setPagination({ ...pagination, page: 1 });
  };
};
