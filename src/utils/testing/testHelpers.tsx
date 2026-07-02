import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
            {children}  
    </QueryClientProvider>
  );

  return Wrapper;
};
