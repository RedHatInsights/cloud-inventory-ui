import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Content,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant
} from '@patternfly/react-core';
import { generateQueryParamsForData } from '../../hooks/util/useQueryParam';
import { Paths } from '../../utils/routing';
import { MarketplacePurchasesSubscriptionsOverflowTable } from './MarketplacePurchasesSubscriptionsOverflowTable';

type Subscription = {
  sku: string;
  description: string;
};

type MarketplacePurchasesSubscriptionsOverflowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  marketplaceAccount: string;
  offeringName: string;
};

export const MarketplacePurchasesSubscriptionsOverflowModal = ({
  isOpen,
  onClose,
  subscriptions,
  marketplaceAccount,
  offeringName
}: MarketplacePurchasesSubscriptionsOverflowModalProps) => {
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="subscriptions-modal-title"
    >
      <ModalHeader title="Subscriptions" labelId="subscriptions-modal-title" />
      <ModalBody>
        <Content>
            <Content component="h4">Offering name</Content>
            <Content component="p">{offeringName}</Content>
            <Content component="h4">Marketplace account</Content>
          <Content component="p">
            <Link
              to={`../${Paths.CloudAccounts}?${generateQueryParamsForData(
                [marketplaceAccount],
                'providerAccountID'
              )}`}
            >
              {marketplaceAccount}
            </Link>
          </Content>
        </Content>
        <br />
        <MarketplacePurchasesSubscriptionsOverflowTable subscriptions={subscriptions} />
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Close         
        </Button>
      </ModalFooter>
    </Modal>
  );
};
