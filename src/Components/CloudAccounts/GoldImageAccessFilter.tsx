import React, { Ref, useState } from 'react';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { goldImageStatusFilterData } from '../../state/cloudAccounts';

interface GoldImageAccessFilterProps {
  availableStatuses: string[];
}

export const GoldImageAccessFilter = ({
  availableStatuses,
}: GoldImageAccessFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useQueryParamInformedAtom(
    goldImageStatusFilterData,
    'goldImageAccess',
  );

  const onSelect = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined,
  ) => {
    if (!value || typeof value !== 'string') {
      return;
    }
    if (!selectedStatuses.includes(value)) {
      setSelectedStatuses([...selectedStatuses, value]);
    }
    setIsOpen(false);
  };

  return (
    <Select
      role="menu"
      isOpen={isOpen}
      selected={selectedStatuses}
      onSelect={onSelect}
      onOpenChange={setIsOpen}
      toggle={(toggleRef: Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsOpen((prev) => !prev)}
          isExpanded={isOpen}
          {...(selectedStatuses.length > 0 && {
            badge: selectedStatuses.length,
          })}
        >
          {selectedStatuses.length === 0 ? 'Filter by status' : 'Status'}
        </MenuToggle>
      )}
    >
      <SelectList>
        {availableStatuses.map((status) => (
          <SelectOption key={status} itemId={status} value={status}>
            {status}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
