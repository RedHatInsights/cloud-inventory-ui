import React, { Ref, useState } from 'react';
import {
  MenuToggle,
  MenuToggleAction,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  ToolbarItem,
} from '@patternfly/react-core';
import { PrimitiveAtom } from 'jotai';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

interface CloudProviderSharedFilterSelectProps<T extends string> {
  filterAtom: PrimitiveAtom<T[]>;
  queryParamKey: string;
  selectOptions: T[];
  labelMap?: Record<string, string>;
  isSplitButton?: boolean;
  toggleLabel?: string;
  splitButtonLabel?: string;
}

export const CloudProviderSharedFilterSelect = <T extends string>({
  filterAtom,
  queryParamKey,
  selectOptions,
  labelMap,
  isSplitButton = true,
  toggleLabel = 'Filter',
  splitButtonLabel = 'Select',
}: CloudProviderSharedFilterSelectProps<T>) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedProviders, setSelectedProviders] = useQueryParamInformedAtom<
    T[]
  >(filterAtom, queryParamKey);
  const onSelect = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined,
  ) => {
    const selection = value as T;
    if (selectedProviders.includes(selection)) {
      setSelectedProviders(selectedProviders.filter((s) => s !== selection));
    } else {
      setSelectedProviders([...selectedProviders, selection]);
    }
  };

  return (
    <ToolbarItem>
      <Select
        role="menu"
        isOpen={isFilterExpanded}
        selected={selectedProviders}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setIsFilterExpanded(isOpen)}
        toggle={(toggleRef: Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            isExpanded={isFilterExpanded}
            {...(selectedProviders.length > 0 && {
              badge: selectedProviders.length,
            })}
            {...(isSplitButton && {
              splitButtonItems: [
                <MenuToggleAction
                  key="label"
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  {splitButtonLabel}
                </MenuToggleAction>,
              ],
            })}
          >
            {toggleLabel}
          </MenuToggle>
        )}
      >
        <SelectList>
          {selectOptions.map((option) => (
            <SelectOption key={option} itemId={option} value={option}>
              {labelMap ? labelMap[option as string] : option}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </ToolbarItem>
  );
};
