import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import React from 'react';

export const NoCloudAccounts = () => (
  <EmptyState
    variant="lg"
    titleText="Cloud Accounts Available"
    headingLevel="h4"
    icon={CubesIcon}
  >
    <EmptyStateBody>
      Cloud accounts appear here when they are connected through Integrations.
      Additionally, accounts will show up here if auto-registration or gold
      image access is initiated on the cloud provider. Please refer to the
      documentation for further guidance.
    </EmptyStateBody>
    <EmptyStateActions>
      <Button variant="link">View documentation</Button>
    </EmptyStateActions>
  </EmptyState>
);
