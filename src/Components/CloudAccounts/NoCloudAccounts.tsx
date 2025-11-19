import { Content, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import React from 'react';

export const NoCloudAccounts = () => (
  <EmptyState icon={WrenchIcon} titleText="No cloud accounts">
    <EmptyStateBody>
      <Content>You do not have any cloud accounts connected.</Content>
    </EmptyStateBody>
  </EmptyState>
);
