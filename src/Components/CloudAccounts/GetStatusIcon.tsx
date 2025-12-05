import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  WrenchIcon,
} from '@patternfly/react-icons';
import React from 'react';

export const getStatusIcon = (status: string, label: string) => {
  switch (status) {
    case 'Granted':
      return <CheckCircleIcon color="green" aria-label={label} title={label} />;
    case 'Failed':
      return (
        <ExclamationCircleIcon color="red" aria-label={label} title={label} />
      );
    case 'Requested':
      return <WrenchIcon color="black" aria-label={label} title={label} />;
    default:
      return null;
  }
};
