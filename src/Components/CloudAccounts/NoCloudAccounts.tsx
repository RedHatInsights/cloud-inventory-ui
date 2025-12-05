import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
} from '@patternfly/react-core';
import React from 'react';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';

export const NoCloudAccounts = () => (
  <EmptyState
    titleText="Cloud Accounts Available"
    headingLevel="h4"
    icon={CubesIcon}
  >
    <EmptyStateBody>
      Cloud accounts appear when they are connected through
      integrations.Additionally, accounts will show up here if auto-registration
      or gold image access is initiated on the cloud provider. Please refer to
      the documentation for further guidance.
    </EmptyStateBody>
    <EmptyStateActions>
      <Button variant="link">View documentation</Button>
    </EmptyStateActions>
  </EmptyState>
);
