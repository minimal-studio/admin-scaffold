import React from 'react';
import { Alert, Card } from '@deer-ui/core';

export const Alerts = () => {
  return (
    <Card container>
      <Card>
        <div className="alerts">
          <h3 className="ps10">Basic Usage</h3>
          <Alert title="Alert success" type="success" />
          <Alert title="Alert error" type="error" />
          <Alert title="Alert warn" type="warn" />
          <Alert title="Alert normal" type="normal" />
        </div>
      </Card>
      <hr />
      <Card>
        <div className="alerts">
          <h3 className="ps10">With text</h3>
          <Alert title="Alert success" type="success" text="with text" />
        </div>
      </Card>
      <hr />
      <Card>
        <div className="alerts">
          <h3 className="ps10">With texts</h3>
          <Alert title="Alert success" type="success"
            texts={[
              "desc1",
              "desc2",
              "desc3",
            ]}
          />
        </div>
      </Card>
      <hr />
      <Card>
        <div className="alerts">
          <h3 className="ps10">Collapsable</h3>
          <Alert
            title="Alert success"
            collapse
            type="success"
            text="with text"
          />
        </div>
      </Card>
    </Card>
  );
};
