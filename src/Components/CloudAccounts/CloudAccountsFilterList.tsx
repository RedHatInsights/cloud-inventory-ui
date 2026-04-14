import React from 'react';
import {
  Button,
  Label,
  LabelGroup,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  cloudAccountIDFilterData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../state/cloudAccounts';
import { ProviderLabelMap } from '../../types/cloudAccountsTypes';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { useClearCloudAccountFilters } from '../util/useClearCloudAccountFilters';

type FilterCategory = 'ID' | 'Provider' | 'Status';

const FILTER_LABELS: Record<FilterCategory, string> = {
  ID: 'Cloud account',
  Provider: 'Cloud provider',
  Status: 'Gold image access',
};

export const CloudAccountsFilterList = () => {
  const [selectedProviders, setSelectedProviders] = useQueryParamInformedAtom(
    cloudProviderFilterData,
    'shortName',
  );
  const [selectedStatuses, setSelectedStatuses] = useQueryParamInformedAtom(
    goldImageStatusFilterData,
    'goldImageAccess',
  );
  const [selectedID, setSelectedID] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );

  const clearFilters = useClearCloudAccountFilters();

  const hasActiveFilters =
    selectedID !== '' ||
    selectedProviders.length > 0 ||
    selectedStatuses.length > 0;

  return (
    <ToolbarContent>
      <ToolbarGroup variant="filter-group">
        {selectedID && (
          <LabelGroup categoryName={FILTER_LABELS.ID}>
            <Label onClose={() => setSelectedID('')}>{selectedID}</Label>
          </LabelGroup>
        )}
        {selectedProviders.length > 0 && (
          <LabelGroup categoryName={FILTER_LABELS.Provider}>
            {selectedProviders.map((provider) => (
              <Label
                key={provider}
                onClose={() =>
                  setSelectedProviders(
                    selectedProviders.filter((p) => p !== provider),
                  )
                }
              >
                {ProviderLabelMap[provider] ?? provider}
              </Label>
            ))}
          </LabelGroup>
        )}
        {selectedStatuses.length > 0 && (
          <LabelGroup categoryName={FILTER_LABELS.Status}>
            {selectedStatuses.map((status) => (
              <Label
                key={status}
                onClose={() =>
                  setSelectedStatuses(
                    selectedStatuses.filter((s) => s !== status),
                  )
                }
              >
                {status}
              </Label>
            ))}
          </LabelGroup>
        )}
      </ToolbarGroup>
      {hasActiveFilters && (
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="link" onClick={clearFilters} isInline>
              Clear all filters         
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      )}
    </ToolbarContent>
  );
};
