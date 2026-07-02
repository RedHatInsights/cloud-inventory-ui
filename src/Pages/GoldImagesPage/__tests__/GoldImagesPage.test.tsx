import { renderWithRouter } from '../../../utils/testing/customRender';
import { screen, waitFor } from '@testing-library/react';
import { GoldImagesPage } from '../GoldImagesPage';
import React from 'react';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Navigate: () => {
    mockNavigate();
    return <div data-testid="navigate" />;
  },
}));

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  fetchDefaultWorkspace: jest.fn(() => Promise.resolve({ id: 'org-id' })),
  useAccessCheckContext: jest.fn(() => ({})),
}));

jest.mock('@project-kessel/react-kessel-access-check/core/api-client', () => ({
  checkSelf: (...args: unknown[]) => mockNavigate(...args),
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

    mockNavigate.mockResolvedValue({
      allowed: 'ALLOWED_TRUE',
    });

    mockNavigate.mockClear();
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('renders', async () => {
    renderWithRouter(<ComponentWithQueryClient />);

    expect(await screen.findByText('Gold Images')).toBeInTheDocument();
  });

  it('redirects on missing permission', async () => {
    mockNavigate.mockResolvedValueOnce({
      allowed: 'ALLOWED_FALSE',
    });

    renderWithRouter(<ComponentWithQueryClient />);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('renders empty state when no gold images are present', async () => {
    queryClient.setQueryData(['goldImages'], {});

    renderWithRouter(<ComponentWithQueryClient />);

    expect(await screen.findByText('No gold images')).toBeInTheDocument();
  });
});
