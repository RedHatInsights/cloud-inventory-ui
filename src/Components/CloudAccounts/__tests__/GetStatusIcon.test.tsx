import { render, screen } from '@testing-library/react';
import {
  CloudAccountStatus,
  getStatusIcon,
  toCloudAccountStatus,
} from '../GetStatusIcon';

describe('toCloudAccountStatus', () => {
  it('returns Granted when passed "Granted"', () => {
    expect(toCloudAccountStatus('Granted')).toBe(CloudAccountStatus.Granted);
  });

  it('returns Failed when passed "Failed"', () => {
    expect(toCloudAccountStatus('Failed')).toBe(CloudAccountStatus.Failed);
  });

  it('returns Requested when passed "Requested"', () => {
    expect(toCloudAccountStatus('Requested')).toBe(
      CloudAccountStatus.Requested
    );
  });

  it('returns Requested for unknown values (default)', () => {
    expect(toCloudAccountStatus('???')).toBe(CloudAccountStatus.Requested);
  });
});

describe('getStatusIcon', () => {
  it('renders green check icon for Granted', () => {
    render(getStatusIcon(CloudAccountStatus.Granted, 'Access Granted')!);
    const icon = screen.getByLabelText('Access Granted');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'green');
    expect(icon.querySelector('title')?.textContent).toBe('Access Granted');
  });

  it('renders red exclamation icon for Failed', () => {
    render(getStatusIcon(CloudAccountStatus.Failed, 'Access Failed')!);
    const icon = screen.getByLabelText('Access Failed');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'red');
    expect(icon.querySelector('title')?.textContent).toBe('Access Failed');
  });

  it('renders black wrench icon for Requested', () => {
    render(getStatusIcon(CloudAccountStatus.Requested, 'Pending Request')!);
    const icon = screen.getByLabelText('Pending Request');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('color', 'black');
    expect(icon.querySelector('title')?.textContent).toBe('Pending Request');
  });

  it('returns null for unknown status (default case)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getStatusIcon('something' as any, '???');
    expect(result).toBeNull();
  });

  it('handles empty label gracefully', () => {
    render(getStatusIcon(CloudAccountStatus.Requested, '')!);
    const icon = screen.getByLabelText('');
    expect(icon).toBeInTheDocument();
    expect(icon.querySelector('title')).toBeNull();
  });
});
