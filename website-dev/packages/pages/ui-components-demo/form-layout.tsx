import React from 'react';
import {
  Alert, Card, Grid, FormLayout
} from '@deer-ui/core';
import { FormOptions } from '@deer-ui/core/form-generator/form-filter';

const formOptions: FormOptions = [
  {
    type: 'input',
    ref: 'Input',
  },
  {
    type: 'select',
    ref: 'Select',
    values: {
      value1: 'radio-1',
      value2: 'radio-2',
      value3: 'radio-3',
    }
  },
  {
    type: 'radio',
    ref: 'Radio',
    values: {
      value1: 'radio-1',
      value2: 'radio-2',
      value3: 'radio-3',
    }
  },
  {
    type: 'checkbox',
    ref: 'Checkbox',
    values: {
      value1: 'radio-1',
      value2: 'radio-2',
      value3: 'radio-3',
    }
  },
  {
    type: 'switch',
    ref: 'Switch',
    hints: ['on', 'off']
  }
];

export const FormLayoutDemo = () => {
  return (
    <Card container>
      <Grid container space={20}>
        <Grid
          xl={6}
          lg={6}
          sm={12}
        >
          <Card p={20} className="mb20">
            <h3>Horizontal layout</h3>
            <FormLayout
              formOptions={formOptions}
            />
          </Card>
          <Card p={20}>
            <h3>Flow layout</h3>
            <FormLayout
              layout="flow"
              formOptions={formOptions}
            />
          </Card>
        </Grid>
        <Grid
          xl={6}
          lg={6}
          sm={12}
        >
          <Card p={20} className="mb20">
            <h3>Vertical layout</h3>
            <FormLayout
              layout="vertical"
              formOptions={formOptions}
            />
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};
