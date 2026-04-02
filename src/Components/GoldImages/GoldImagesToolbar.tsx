import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import React from 'react';
import { GoldImagesResponse } from '../../hooks/api/useGoldImages';
import { GoldImagesPagination } from './GoldImagesPagination';
import { CloudProviderSharedFilterList } from '../shared/CloudProviderSharedFilterList';
import { cloudProviderFilterData as goldImageAtom } from '../../state/goldImages';
import { CloudProviderSharedFilterSelect } from '../shared/CloudProviderSharedFilterSelect';

interface GoldImagesFilterBarProps {
  goldImages: GoldImagesResponse;
}

export const GoldImagesToolbar = ({ goldImages }: GoldImagesFilterBarProps) => {
  const cloudProviders = Object.values(goldImages).map(
    (goldImage) => goldImage.provider,
  );

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <CloudProviderSharedFilterSelect
            filterAtom={goldImageAtom}
            queryParamKey="cloudProvider"
            selectOptions={cloudProviders}
          />
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <GoldImagesPagination isCompact />
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Toolbar>
        <ToolbarContent>
          <CloudProviderSharedFilterList
            filterAtom={goldImageAtom}
            queryParamKey="cloudProvider"
          />
        </ToolbarContent>
      </Toolbar>
    </>
  );
};
