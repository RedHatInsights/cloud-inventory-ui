import { render, screen } from '@testing-library/react';
import { getStatusIcon } from '../GetStatusIcon';

describe('getStatusIcon', () => {
  it('returns green check icon for Granted', () => {
    render(getStatusIcon('Granted', 'Granted'));
    const icon = screen.getByLabelText('Granted');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'green');
  });

  it('returns red exclamation icon for Failed', () => {
    render(getStatusIcon('Failed', 'Failed'));
    const icon = screen.getByLabelText('Failed');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'red');
  });

  it('returns black wrench icon for Requested', () => {
    render(getStatusIcon('Requested', 'Requested'));
    const icon = screen.getByLabelText('Requested');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'black');
  });

  it('returns null for unknown status', () => {
    const result = getStatusIcon('Unknown', 'Unknown');
    expect(result).toBeNull();
  });
});
