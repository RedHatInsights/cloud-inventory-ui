import { renderWithRouter } from '../../../utils/testing/customRender';
import { screen, waitFor } from '@testing-library/react';
import { GoldImagesPage } from '../GoldImagesPage';
import React from 'react';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';

const mockCheck = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Navigate: () => {
    mockCheck();
    return <div data-testid="navigate" />;
  },
}));

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  fetchDefaultWorkspace: jest.fn(() => Promise.resolve({ id: 'org-id' })),
  useAccessCheckContext: jest.fn(() => ({})),
}));

jest.mock('@project-kessel/react-kessel-access-check/core/api-client', () => ({
  checkSelf: (...args: unknown[]) => mockCheck(...args),
}));

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <GoldImagesPage />,
);

describe('Gold images page', () => {
  beforeEach(() => {
    queryClient.clear();

    queryClient.setQueryData(['goldImages'], {
      AWS: { provider: 'AWS', goldImages: [] },
    });

    mockCheck.mockResolvedValue({
      allowed: 'ALLOWED_TRUE',
    });

    mockCheck.mockClear();
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('renders', async () => {
    renderWithRouter(<ComponentWithQueryClient />);

    await waitFor(() =>
      expect(screen.queryByText('Gold Images')).toBeInTheDocument(),
    );
  });

  it('redirects on missing permission', async () => {
    mockCheck.mockResolvedValueOnce({
      allowed: 'ALLOWED_FALSE',
    });

    renderWithRouter(<ComponentWithQueryClient />);

    await waitFor(() => expect(mockCheck).toHaveBeenCalled());
  });

  it('renders empty state when no gold images are present', async () => {
    queryClient.setQueryData(['goldImages'], {});

    renderWithRouter(<ComponentWithQueryClient />);

    await waitFor(() =>
      expect(screen.queryByText('No gold images')).toBeInTheDocument(),
    );
  });
});
