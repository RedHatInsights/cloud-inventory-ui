import { Button, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import React from 'react';
import { PaginationData } from '../../types/pagination';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface PaginationErrorProps {
  pagination: PaginationData;
  setPagination: (v: PaginationData) => void;
}

export const PaginationError = ({
  pagination,
  setPagination,
}: PaginationErrorProps) => {
  return (
    <EmptyState variant="lg" icon={InfoCircleIcon}>
      <EmptyStateBody>
        No results for current page. <br />
        <br />
        <Button onClick={() => setPagination({ ...pagination, page: 1 })}>
          Return to page 1
        </Button>
      </EmptyStateBody>
    </EmptyState>
  );
};
