import { render } from '@testing-library/react';
import { Loading } from '../Loading';
import React from 'react';

describe('Loading', () => {
  it('renders', () => {
    const { container } = render(<Loading />);

    expect(
      container.querySelector('[aria-valuetext="Loading..."]')
    ).toBeInTheDocument();
  });
});
