import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { CloudAccountIDFilter } from '../CloudAccountIDFilter';
import { cloudAccountIDFilterData } from '../../../state/cloudAccounts';

const CloudAccountIDFilterWithState = ({ initialValue = '' }) => (
  <HydrateAtomsTestProvider
    initialValues={[[cloudAccountIDFilterData, initialValue]]}
  >
    <CloudAccountIDFilter />
  </HydrateAtomsTestProvider>
);

describe('CloudAccountIDFilter AC Tests', () => {
  it('displays the correct account id when state is "123"', () => {
    renderWithRouter(<CloudAccountIDFilterWithState initialValue="123" />);

    const input = screen.getByPlaceholderText(
      'Filter by account ID',
    ) as HTMLInputElement;
    expect(input.value).toBe('123');
  });

  it('updates the input value when the user types "123"', () => {
    renderWithRouter(<CloudAccountIDFilterWithState />);
    const input = screen.getByPlaceholderText('Filter by account ID');

    fireEvent.change(input, { target: { value: '123' } });
    expect(input).toHaveValue('123');
  });

  it('clears the input value when the "x" (reset) button is clicked', () => {
    renderWithRouter(<CloudAccountIDFilterWithState initialValue="781" />);

    const input = screen.getByPlaceholderText(
      'Filter by account ID',
    ) as HTMLInputElement;

    expect(input.value).toBe('781');

    const clearButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('is empty when no initial value is provided', () => {
    renderWithRouter(<CloudAccountIDFilterWithState initialValue="" />);

    const input = screen.getByPlaceholderText('Filter by account ID');
    expect(input).toHaveValue('');
    expect(
      screen.queryByRole('button', { name: /reset/i }),
    ).not.toBeInTheDocument();
  });
});
