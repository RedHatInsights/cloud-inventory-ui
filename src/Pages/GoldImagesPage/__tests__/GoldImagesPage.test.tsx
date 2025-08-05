import { render, screen, waitFor } from '@testing-library/react';
import { GoldImagesPage } from '../GoldImagesPage';
import React from 'react';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Navigate: () => {
    mockNavigate();
    return <div data-testid="navigate" />;
  },
}));

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <GoldImagesPage />
);

describe('Gold images page', () => {
  beforeEach(() => {
    queryClient.setQueryData(['goldImages'], {
      AWS: { provider: 'AWS', goldImages: [] },
    });
    queryClient.setQueryData(['rbacPermissions'], { canReadCloudAccess: true });
    mockNavigate.mockClear();
  });

  it('renders', async () => {
    render(<ComponentWithQueryClient />);

    await waitFor(() =>
      expect(screen.queryByText('Gold Images')).toBeInTheDocument()
    );
  });

  it('redirects on missing permission', async () => {
    queryClient.setQueryData(['rbacPermissions'], {
      canReadCloudAccess: false,
    });

    render(<ComponentWithQueryClient />);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('renders empty state when no gold images are present', async () => {
    queryClient.setQueryData(['goldImages'], {});

    render(<ComponentWithQueryClient />);

    await waitFor(() =>
      expect(screen.queryByText('No gold images')).toBeInTheDocument()
    );
  });
});
