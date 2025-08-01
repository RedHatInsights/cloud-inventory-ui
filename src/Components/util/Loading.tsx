import React from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

export const Loading = () => {
  return (
    <Bullseye>
      <Spinner></Spinner>
    </Bullseye>
  );
};
