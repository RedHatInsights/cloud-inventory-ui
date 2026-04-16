import React, { useState } from 'react';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  ToolbarItem,
} from '@patternfly/react-core';
import { cloudProviderFilterData } from '../../state/cloudAccounts';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import {
  CloudProviderShortname,
  ProviderLabelMap,
} from '../../types/cloudAccountsTypes';

interface CloudAccountProviderFilterProps {
  availableProviders: CloudProviderShortname[];
}

export const CloudAccountProviderFilter: React.FC<
  CloudAccountProviderFilterProps
> = ({ availableProviders }) => {
  const [selectedProviders, setSelectedProviders] = useQueryParamInformedAtom(
    cloudProviderFilterData,
    'shortName',
  );
  const [isOpen, setIsOpen] = useState(false);

  const onToggleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onSelect = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined,
  ) => {
    if (!value || typeof value !== 'string') {
      setIsOpen(false);
      return;
    }

    const provider = value as CloudProviderShortname;

    if (!selectedProviders.includes(provider)) {
      setSelectedProviders([...selectedProviders, provider]);
    }

    setIsOpen(false);
  };

  return (
    <ToolbarItem>
            
      <Select
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSelect={onSelect}
        selected={selectedProviders}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={onToggleClick}
            isExpanded={isOpen}
          >
                        Filter by cloud provider           
          </MenuToggle>
        )}
      >
                
        <SelectList>
                    
          {availableProviders.map((provider) => (
            <SelectOption
              key={provider}
              value={provider}
              isSelected={selectedProviders.includes(provider)}
            >
                            {ProviderLabelMap[provider] ?? provider}
                          
            </SelectOption>
          ))}
                  
        </SelectList>
              
      </Select>
          
    </ToolbarItem>
  );
};
