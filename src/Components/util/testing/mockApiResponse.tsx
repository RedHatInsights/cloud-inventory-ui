import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

interface MockedRequest {
  ok: boolean;
  body: unknown;
}

let mockMap: Record<string, MockedRequest> = {};

export const enableMocks = () => {
  jest.spyOn(global, 'fetch').mockImplementation(
    jest.fn((url: string) => {
      if (mockMap[url]) {
        return Promise.resolve({
          json: () => {
            return Promise.resolve(mockMap[url].body);
          },
          ok: mockMap[url].ok,
        });
      } else {
        return Promise.reject('No url mocked');
      }
    }) as jest.Mock
  );
};

export const mockApiResponse = (
  url: string,
  payload: unknown,
  success: boolean
) => {
  mockMap[url] = { body: payload, ok: success };
};

export const resetMocks = () => (mockMap = {});

export class RequestMocks {
  map: Record<string, MockedRequest>;
  wrapper;
  queryClient;

  constructor() {
    this.map = {};
    global.fetch = jest.fn().mockImplementation(
      jest.fn((url: string) => {
        if (this.map[url]) {
          return Promise.resolve({
            json: () => {
              return Promise.resolve(this.map[url].body);
            },
            ok: this.map[url].ok,
          });
        } else {
          return Promise.reject('No url mocked');
        }
      }) as jest.Mock
    );

    this.queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    this.wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={this.queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  addMock(url: string, payload: unknown, success = true) {
    this.map[url] = { body: payload, ok: success };
  }

  reset() {
    this.queryClient.resetQueries();
    this.map = {};
  }
}
