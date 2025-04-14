import { Content } from '@patternfly/react-core';
import React from 'react';

interface HelloProps {
  name: string;
}

export const Hello = ({ name }: HelloProps) => (
  <Content component="p">Hello, {name}</Content>
);
