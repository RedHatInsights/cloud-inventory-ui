import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import React from 'react';
import { GoldImagesResponse } from '../../hooks/api/useGoldImages';
import { CloudProviderFilterSelect } from './CloudProviderFilterSelect';
import { GoldImagesPagination } from './GoldImagesPagination';
import { CloudProviderFilterList } from './CloudProviderFilterList';

interface GoldImagesFilterBarProps {
  goldImages: GoldImagesResponse;
}

export const GoldImagesToolbar = ({ goldImages }: GoldImagesFilterBarProps) => {
  const cloudProviders = Object.values(goldImages).map(
    (goldImage) => goldImage.provider
  );

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <CloudProviderFilterSelect cloudProviders={cloudProviders} />
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <GoldImagesPagination isCompact />
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Toolbar>
        <ToolbarContent>
          <CloudProviderFilterList />
        </ToolbarContent>
      </Toolbar>
    </>
  );
};
