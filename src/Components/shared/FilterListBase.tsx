import React from 'react';
import { Button, Label, LabelGroup } from '@patternfly/react-core';
import { PrimitiveAtom } from 'jotai';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

interface FilterListBaseProps {
  atom: PrimitiveAtom<string[]>;
  queryParam: string;
  label: string;
}

export const FilterListBase = ({
  atom,
  queryParam,
  label,
}: FilterListBaseProps) => {
  const [values, setValues] = useQueryParamInformedAtom<string[]>(
    atom,
    queryParam
  );

  return (
    <LabelGroup categoryName={label}>
      {values.map((value: string) => (
        <Label
          key={value}
          onClose={() => setValues(values.filter((v) => v !== value))}
        >
          {value}
        </Label>
      ))}

      {values.length > 0 && (
        <Button variant="link" onClick={() => setValues([])}>
          Clear filters
        </Button>
      )}
    </LabelGroup>
  );
};
