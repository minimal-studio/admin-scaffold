import React from 'react';
import {
  Card, Grid,
  Input, InputNumber, Dropdown, Radio, Checkbox,
  InputSelector
} from '@deer-ui/core';

export const Forms = () => {
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
            <Input placeholder="string" className="mr10" />
            <Input placeholder="password" type="password" className="mr10" />
            <Input placeholder="block" className="mt10" block />
          </Card>
          <Card p={20} className="mb10">
            <h3>Inline title</h3>
            <Input title="string" placeholder="input anything" block className="mb10" />
            <Input title="password" placeholder="input password" block type="password" />
          </Card>
          <Card p={20} className="mb10">
            <h3>Rise up title when focus</h3>
            <Input title="string" block className="mb10" riseTitle />
            <Input title="password" block type="password" riseTitle />
          </Card>
          <Card p={20} className="mb10">
            <h3>Filter input</h3>
            <Input title="only can input number" block className="mb10" filter={(val) => {
              return +val || 0;
            }}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>Size</h3>
            <Input
              block
              size="xl"
              className="mb10"
              placeholder="xl input"
            />
            <Input
              block
              size="lg"
              className="mb10"
              placeholder="lg input"
            />
            <Input
              block
              size="md"
              className="mb10"
              placeholder="md input"
            />
            <Input
              block
              size="sm"
              className="mb10"
              placeholder="sm input"
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>With action button</h3>
            <Input
              title="With button"
              outputType="number"
              inputBtnConfig={{
                action: (e) => console.log(e),
                text: 'Submit'
              }}
            />
            <hr />
            <Input
              title="With icon button"
              outputType="number"
              inputBtnConfig={{
                action: (e) => console.log(e),
                icon: 'search',
                text: 'Search'
              }}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>With Icon</h3>
            <Input
              icon="phone"
              block
              placeholder="phone number"
              outputType="number"
            />
          </Card>
        </Grid>
        <Grid
          xl={6}
          lg={6}
          sm={12}
        >
          <Card p={20} className="mb10">
            <h3>Radio</h3>
            <Radio
              values={{
                value1: 'radio-1',
                value2: 'radio-2',
                value3: 'radio-3',
              }}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>Checkbox</h3>
            <Checkbox
              values={{
                value1: 'checkbox-1',
                value2: 'checkbox-2',
                value3: 'checkbox-3',
              }}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>Dropdown</h3>
            <Dropdown
              values={{
                value1: 'checkbox-1',
                value2: 'checkbox-2',
                value3: 'checkbox-3',
              }}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>Input Selector</h3>
            <InputSelector
              values={{
                value1: 'checkbox-1',
                value2: 'checkbox-2',
                value3: 'checkbox-3',
              }}
            />
          </Card>
          <Card p={20} className="mb10">
            <h3>Input Number</h3>
            <p>0 ~ 10 input limit</p>
            <InputNumber
              className="mb10"
              numRange={[0, 10]}
            />
            <hr />
            <p>max 2 unit length number input limit</p>
            <InputNumber
              className="mb10"
              lenRange={[0, 2, true]}
            />
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};
