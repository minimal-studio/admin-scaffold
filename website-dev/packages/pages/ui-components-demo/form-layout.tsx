import React from 'react';
import {
  Alert, Card, Grid, FormLayout, ShowModal
} from '@deer-ui/core';
import { FormOptions } from '@deer-ui/core/form-generator/form-filter';
import { FormLayoutBtnsConfig } from '@deer-ui/core/form-layout/form-layout';

const formBtns: FormLayoutBtnsConfig = [
  {
    actingRef: 'submitting',
    action: ({ value }, actingRef) => {
      console.log(value, actingRef);
      ShowModal({
        title: 'Form output value',
        children: (
          <div className="p20">
            <h4>Form output value</h4>
            <p>{JSON.stringify(value)}</p>
          </div>
        )
      });
    },
    text: 'Submit'
  }
];

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
              formBtns={formBtns}
              formOptions={formOptions}
            />
          </Card>
          <Card p={20}>
            <h3>Flow layout</h3>
            <FormLayout
              layout="flow"
              formBtns={formBtns}
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
              formBtns={formBtns}
              formOptions={formOptions}
            />
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};
