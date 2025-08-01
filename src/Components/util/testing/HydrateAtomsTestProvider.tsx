import type { ReactNode } from 'react';
import { Provider } from 'jotai';
import type { WritableAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import React from 'react';

interface HydrateAtomsInitialValues {
  initialValues: Iterable<
    // Hydrate struggles with typing here, so this any is required
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly [WritableAtom<unknown, [any], unknown>, unknown]
  >;
  children: ReactNode;
}

const AtomsHydrator = ({
  initialValues,
  children,
}: HydrateAtomsInitialValues) => {
  useHydrateAtoms(new Map(initialValues));
  return children;
};

export const HydrateAtomsTestProvider = ({
  initialValues,
  children,
}: HydrateAtomsInitialValues) => {
  return (
    <Provider>
      <AtomsHydrator initialValues={initialValues}>{children}</AtomsHydrator>
    </Provider>
  );
};
