import React from 'react';
import { Alert, CardContainer, Card } from '@deer-ui/core';

export const Alerts = () => {
  return (
    <CardContainer>
      <Card>
        <div className="alerts">
          <Alert title="Alert" />
        </div>
      </Card>
    </CardContainer>
  );
};
