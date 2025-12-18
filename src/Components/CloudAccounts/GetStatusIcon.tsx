import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  WrenchIcon,
} from '@patternfly/react-icons';
import React from 'react';

export enum CloudAccountStatus {
  Granted = 'Granted',
  Failed = 'Failed',
  Requested = 'Requested',
}

export const getStatusIcon = (status: CloudAccountStatus, label: string) => {
  switch (status) {
    case CloudAccountStatus.Granted:
      return <CheckCircleIcon color="green" aria-label={label} title={label} />;

    case CloudAccountStatus.Failed:
      return (
        <ExclamationCircleIcon color="red" aria-label={label} title={label} />
      );

    case CloudAccountStatus.Requested:
      return <WrenchIcon color="black" aria-label={label} title={label} />;

    default:
      return null;
  }
};
