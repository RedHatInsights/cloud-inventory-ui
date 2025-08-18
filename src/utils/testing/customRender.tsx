import React, { ReactElement } from 'react';
import {
  Queries,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
  queries,
  render,
  renderHook,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      {children}
    </BrowserRouter>
  );
};

/**
 * Custom render function that wraps every component in a Router
 */
const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: RouterProvider, ...options });
};

/**
 * Custom renderHook function that wraps every component in a Router
 */
function renderHookWithRouter<
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>
): RenderHookResult<Result, Props> {
  const ProvidedWrapper = options?.wrapper;
  const CustomWrapper = ProvidedWrapper
    ? ({ children }: { children: React.ReactNode }) => (
        <RouterProvider>
          <ProvidedWrapper>{children}</ProvidedWrapper>
        </RouterProvider>
      )
    : RouterProvider;
  return renderHook(render, {
    ...options,
    wrapper: CustomWrapper,
  });
}

export { renderWithRouter };
export { renderHookWithRouter };
