import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export const ManipulatableQueryWrapper = (children: JSX.Element) => ({
  ComponentWithQueryClient: () => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
  queryClient,
});
