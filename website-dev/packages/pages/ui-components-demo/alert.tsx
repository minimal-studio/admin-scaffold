import React from 'react';
import { Alert, Card, Grid } from '@deer-ui/core';

export const Alerts = () => {
  return (
    <Card container>
      <Grid container space={20}>
        <Grid
          xl={6}
          lg={6}
          sm={12}
        >
          <Card p={20} className="mb10">
            <h3>Basic Usage</h3>
            <Alert title="Alert success" type="success" />
            <Alert title="Alert error" type="error" />
            <Alert title="Alert warn" type="warn" />
            <Alert title="Alert normal" type="normal" />
          </Card>
          <Card p={20} className="mb10">
            <h3>With text</h3>
            <Alert title="Alert" text="with text" />
          </Card>
        </Grid>
        <Grid
          xl={6}
          lg={6}
          sm={12}
        >
          <Card p={20} className="mb10">
            <h3>With texts</h3>
            <Alert title="Alert"
              texts={[
                "desc1",
                "desc2",
                "desc3",
              ]}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>Collapsable</h3>
            <Alert
              title="Alert"
              collapse
              text="Collapsable"
            />
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};
