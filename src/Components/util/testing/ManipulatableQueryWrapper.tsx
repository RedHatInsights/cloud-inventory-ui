import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity
    }
  }
});

export const ManipulatableQueryWrapper = (children: JSX.Element) => ({
  ComponentWithQueryClient: () => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
  queryClient
});
