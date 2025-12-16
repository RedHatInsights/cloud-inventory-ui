import { render, screen } from '@testing-library/react';
import { CloudAccountStatus, getStatusIcon } from '../GetStatusIcon';

describe('getStatusIcon', () => {
  it('renders green check icon for Granted', () => {
    render(getStatusIcon(CloudAccountStatus.Granted, 'Access Granted')!);
    const icon = screen.getByLabelText('Access Granted');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'green');
    const title = icon.querySelector('title');
    expect(title?.textContent).toBe('Access Granted');
  });

  it('renders red exclamation icon for Failed', () => {
    render(getStatusIcon(CloudAccountStatus.Failed, 'Access Failed')!);
    const icon = screen.getByLabelText('Access Failed');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'red');
    const title = icon.querySelector('title');
    expect(title?.textContent).toBe('Access Failed');
  });

  it('renders black wrench icon for Requested', () => {
    render(getStatusIcon(CloudAccountStatus.Requested, 'Pending Request')!);
    const icon = screen.getByLabelText('Pending Request');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'black');
    const title = icon.querySelector('title');
    expect(title?.textContent).toBe('Pending Request');
  });

  it('returns null for unknown status', () => {
    const result = getStatusIcon('UNKNOWN' as CloudAccountStatus, '???');
    expect(result).toBeNull();
  });

  it('renders icon even with empty label', () => {
    render(getStatusIcon(CloudAccountStatus.Requested, '')!);

    const icon = screen.getByLabelText('');
    expect(icon).toBeInTheDocument();
    const title = icon.querySelector('title');
    expect(title).toBeNull();
  });
});
