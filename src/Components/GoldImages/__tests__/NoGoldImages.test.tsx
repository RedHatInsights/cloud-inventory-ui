import { render, screen } from '@testing-library/react';
import { NoGoldImages } from '../NoGoldImages';
import React from 'react';

describe('No gold images', () => {
  it('renders', () => {
    render(<NoGoldImages />);

    expect(screen.queryByText('No gold images')).toBeInTheDocument();
  });
});
