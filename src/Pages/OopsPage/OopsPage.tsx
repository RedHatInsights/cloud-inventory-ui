import React, { useEffect } from 'react';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

const OopsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('oops-page');
  }, []);

  return (
    <Section>
      <Unavailable />
    </Section>
  );
};

export default OopsPage;
