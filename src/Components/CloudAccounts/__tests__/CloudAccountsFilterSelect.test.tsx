import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { CloudAccountsFilterSelect } from '../CloudAccountsFilterSelect';
import {
  cloudAccountsAccountFilterData,
  cloudAccountsGoldImageFilterData,
  cloudAccountsProviderFilterData,
} from '../../../state/cloudAccounts';
import { getDefaultStore } from 'jotai';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithState = ({ init = {} as any }) => (
  <HydrateAtomsTestProvider
    initialValues={[
      [cloudAccountsAccountFilterData, init.account ?? []],
      [cloudAccountsProviderFilterData, init.provider ?? []],
      [cloudAccountsGoldImageFilterData, init.gold ?? []],
    ]}
  >
    <CloudAccountsFilterSelect />
  </HydrateAtomsTestProvider>
);
const store = getDefaultStore();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readAtom = (atom: any) => store.get(atom);
beforeEach(() => {
  store.set(cloudAccountsAccountFilterData, []);
  store.set(cloudAccountsProviderFilterData, []);
  store.set(cloudAccountsGoldImageFilterData, []);
});
describe('CloudAccountsFilterSelect', () => {
  it('renders default label', () => {
    renderWithRouter(<WithState />);
    expect(screen.getByText('Cloud account')).toBeInTheDocument();
  });
  it('opens showing all filter types', async () => {
    renderWithRouter(<WithState />);
    fireEvent.click(screen.getByText('Cloud account'));
    await waitFor(() =>
      expect(screen.getByText('Cloud provider')).toBeInTheDocument()
    );
    expect(screen.getByText('Auto-registration')).toBeInTheDocument();
    expect(screen.getByText('Gold image access')).toBeInTheDocument();
  });
  it('can select each filter type', async () => {
    renderWithRouter(<WithState />);
    fireEvent.click(screen.getByText('Cloud account'));
    fireEvent.click(screen.getByText('Auto-registration'));
    await waitFor(() =>
      expect(screen.getByText('Auto-registration')).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText('Auto-registration'));
    fireEvent.click(screen.getByText('Gold image access'));
    await waitFor(() =>
      expect(screen.getByText('Gold image access')).toBeInTheDocument()
    );
  });
  it('switching filter type resets ALL atom filters', async () => {
    renderWithRouter(
      <WithState
        init={{
          account: ['a'],
          provider: ['p'],
          gold: ['g'],
        }}
      />
    );
    fireEvent.click(screen.getByText('Cloud account'));
    fireEvent.click(screen.getByText('Cloud provider'));
    await waitFor(() =>
      expect(readAtom(cloudAccountsAccountFilterData)).toEqual([])
    );
    await waitFor(() =>
      expect(readAtom(cloudAccountsProviderFilterData)).toEqual([])
    );
    await waitFor(() =>
      expect(readAtom(cloudAccountsGoldImageFilterData)).toEqual([])
    );
  });
  it('autoRegistration selection does not update any atom', async () => {
    renderWithRouter(<WithState />);
    fireEvent.click(screen.getByText('Cloud account'));
    fireEvent.click(screen.getByText('Auto-registration'));
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    await waitFor(() =>
      expect(readAtom(cloudAccountsAccountFilterData)).toEqual([])
    );
    await waitFor(() =>
      expect(readAtom(cloudAccountsProviderFilterData)).toEqual([])
    );
    await waitFor(() =>
      expect(readAtom(cloudAccountsGoldImageFilterData)).toEqual([])
    );
  });
  it('menu toggles open and closed', async () => {
    renderWithRouter(<WithState />);
    const toggle = screen.getByText('Cloud account');
    fireEvent.click(toggle);
    await waitFor(() =>
      expect(screen.getByText('Cloud provider')).toBeInTheDocument()
    );
    fireEvent.click(toggle);
    await waitFor(() =>
      expect(screen.queryByText('Cloud provider')).not.toBeInTheDocument()
    );
  });
  it('closes when clicking outside', async () => {
    const { container } = renderWithRouter(<WithState />);
    fireEvent.click(screen.getByText('Cloud account'));
    await waitFor(() =>
      expect(screen.getByText('Cloud provider')).toBeInTheDocument()
    );
    fireEvent.mouseDown(container);
    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-menu__item')
      ).not.toBeInTheDocument()
    );
  });
  it('typing does not crash component', async () => {
    renderWithRouter(<WithState />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'xyz' } });
    await waitFor(() => expect(input).toHaveValue('xyz'));
  });
});
