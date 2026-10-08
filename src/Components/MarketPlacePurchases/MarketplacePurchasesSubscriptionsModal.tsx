import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant
} from '@patternfly/react-core';
import { generateQueryParamsForData } from '../../hooks/util/useQueryParam';
import { Paths } from '../../utils/routing';
import { MarketplacePurchasesSubscriptionsTable } from './MarketplacePurchasesSubscriptionsTable';

type Subscription = {
  sku: string;
  description: string;
};

type MarketplacePurchasesSubscriptionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  marketplaceAccount: string;
  offeringName: string;
};

export const MarketplacePurchasesSubscriptionsModal = ({
  isOpen,
  onClose,
  subscriptions,
  marketplaceAccount,
  offeringName
}: MarketplacePurchasesSubscriptionsModalProps) => {
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="subscriptions-modal-title"
    >
      <ModalHeader title="Subscriptions" labelId="subscriptions-modal-title" />
      <ModalBody>
        <div>
          <strong>Offering name</strong>
          <div>{offeringName}</div>
        </div>
        <br />
        <div>
          <strong>Marketplace account</strong>
          <div>
            <Link
              to={`../${Paths.CloudAccounts}?${generateQueryParamsForData(
                [marketplaceAccount],
                'providerAccountID'
              )}`}
            >
              {marketplaceAccount}
            </Link>
          </div>
        </div>
        <br />
        <MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Close         
        </Button>
      </ModalFooter>
    </Modal>
  );
};
