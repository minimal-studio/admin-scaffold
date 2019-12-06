import React from 'react';
import { Container, Grid, Card } from '@deer-ui/core';
import { GenerateNumberRange } from '@mini-code/base-func';


// $container-sm-width: 576px;
// $container-md-width: 768px;
// $container-lg-width: 992px;
// $container-xl-width: 1200px;

const rowCount1 = GenerateNumberRange([1, 12]);
const rowCount3 = GenerateNumberRange([1, 4]);

const GridExtra = ({ row }) => {
  return (
    <Grid
      xl={row}
      lg={row}
      md={row}
      sm={row}
      xs={row}
    >
      <div
        className="bg_default text-center p5"
      >
        row-{row}
      </div>
    </Grid>
  );
};

export const LayoutDemo = () => {
  return (
    <Card container>
      <Container fluid className="mb10">
        <Card p={20}>
          <h3>Card</h3>
          <p>Card container, will render a white background area, just like this.</p>
        </Card>
      </Container>
      <Container fluid className="mb10">
        <Card p={20}>
          <h3>Grid</h3>
          <p>Base on flex layout system</p>
          <Grid container space={10}>
            {
              rowCount1.map((item, idx) => {
                return (
                  <GridExtra key={idx} row={1} />
                );
              })
            }
            {
              rowCount3.map((item, idx) => {
                return (
                  <GridExtra key={idx} row={3} />
                );
              })
            }
            <GridExtra row={5} />
            <GridExtra row={7} />
            <GridExtra row={12} />
          </Grid>
        </Card>
      </Container>
      <Container fluid>
        <Card p={20} className="mb10">
          <h3>Container</h3>
          <p>Container will auto align the side margin</p>
          fluid container, width 100%
        </Card>
      </Container>
      <Container>
        <Card p={20} className="mb10">
          xl-container, max-width 1200px
        </Card>
      </Container>
      <Container size="lg" className="mb10">
        <Card p={20}>
          lg-container, max-width 992px
        </Card>
      </Container>
      <Container size="md" className="mb10">
        <Card p={20}>
          md-container, max-width 768px
        </Card>
      </Container>
      <Container size="sm" className="mb10">
        <Card p={20}>
          sm-container, max-width 576px
        </Card>
      </Container>
    </Card>
  );
};
