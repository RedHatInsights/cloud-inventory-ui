import { Content, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { WrenchIcon } from '@patternfly/react-icons';
import React from 'react';

export const NoGoldImages = () => (
  <EmptyState icon={WrenchIcon} titleText="No gold images">
    <EmptyStateBody>
      <Content>You do not have access to any gold images</Content>
    </EmptyStateBody>
  </EmptyState>
);
