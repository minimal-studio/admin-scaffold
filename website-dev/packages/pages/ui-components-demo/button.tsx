import React from 'react';
import { Button, Card, Grid } from '@deer-ui/core';
import { ForEachColor, ExampleColors } from '@deer-ui/core/utils';

const icons = [
  { icon: 'envelope-open', s: 'r' },
  { icon: 'paper-plane', s: 'r' },
  { icon: 'align-right' },
  { icon: 'bell', s: 'r' },
  { icon: 'check-circle', s: 'r' },
];

export const Buttons = () => {
  return (
    <Card container>
      <Grid container space={20}>
        <Grid
          xl={12}
          lg={12}
          sm={12}
        >
          <Card p={20} className="mb10">
            <h3>Basic Usage</h3>
            <Button
              status="primary"
              className="mr10 mb10"
            >
              Primary
            </Button>
            <Button
              color="default"
              className="mr10 mb10"
            >
              Default
            </Button>
            <Button
              color="danger"
              className="mr10 mb10"
            >
              Danger
            </Button>
            <Button
              disabled
              status="warn"
              className="mr10 mb10"
            >
              Disabled
            </Button>
            <Button
              loading
              color="green"
              className="mr10 mb10"
            >
              Loading
            </Button>
            <Button
              status="link"
              className="mr10 mb10"
            >
              Link
            </Button>
          </Card>
          <Card p={20} className="mb10">
            <h3>Hola</h3>
            <Button
              status="primary"
              hola
              className="mr10 mb10"
            >
              Primary
            </Button>
            <Button
              color="default"
              hola
              className="mr10 mb10"
            >
              Default
            </Button>
            <Button
              color="danger"
              hola
              className="mr10 mb10"
            >
              Danger
            </Button>
            <Button
              disabled
              status="warn"
              hola
              className="mr10 mb10"
            >
              Disabled
            </Button>
            <Button
              loading
              color="green"
              hola
              className="mr10 mb10"
            >
              Loading
            </Button>
            <Button
              status="link"
              hola
              className="mr10 mb10"
            >
              Link
            </Button>
          </Card>
          <Card p={20} className="mb10">
            <h3>Size</h3>
            <Button
              size="xl"
              className="mr10 mb10"
            >
              Extra-Large
            </Button>
            <Button
              size="lg"
              color="green"
              className="mr10 mb10"
            >
              Large
            </Button>
            <Button
              size="md"
              color="orange"
              className="mr10 mb10"
            >
              Middle
            </Button>
            <Button
              size="sm"
              color="red"
              className="mr10 mb10"
            >
              Small
            </Button>
            <Button
              size="tiny"
              color="default"
              className="mr10 mb10"
            >
              Tiny
            </Button>
          </Card>
          <Card p={20} className="mb10">
            <h3>With icon</h3>
            {
              ForEachColor(ExampleColors)((color, idx) => {
                return (
                  <Button key={color}
                    color={color}
                    hola
                    icon={icons[idx].icon}
                    s={icons[idx].s}
                    className="mr10 mb10"
                  >
                    {color.toUpperCase()}
                  </Button>
                );
              })
            }
          </Card>
          <Card p={20} className="mb10">
            <h3>Block</h3>
            <Button
              block
              size="lg"
              className="mr10 mb10"
            >
              Block
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};
