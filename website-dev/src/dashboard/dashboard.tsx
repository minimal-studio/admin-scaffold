import React, { Component } from "react";
import { Link } from '@deer-ui/admin-scaffold';

import {
  Grid, Card, Label, Icon, Button, Table
} from "@deer-ui/core";
import {
  ChartCom
} from "@deer-ui/enhance-ui";
import MockVisitorTable from './mock-visitor';

// ChartCom.setChartJSPath(
//   "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js"
// );


const mockData = {
  labels: [
    "Red", "Blue", "Yellow",
    "Green",
    "Purple", "Orange"
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [42, 12, 33, 11, 22, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)"
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      borderWidth: 1
    }
  ]
};
const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const CardDesc = ({
  icon, desc, descTitle,
  action, actionText, iconBgColor = 'blue'
}) => {
  return (
    <Grid
      xl={3}
      lg={4}
      md={6}
      sm={12}
      xs={12}
    >
      <Card p={20} className="_btn">
        <Grid container alignItems="center">
          <Grid lg={7}>
            <div>
              <div
                className="mb10"
                style={{
                  color: '#999'
                }}
              >{descTitle}</div>
              <strong
                style={{
                  fontSize: 22
                }}
              >
                {desc}
              </strong>
            </div>
          </Grid>
          <Grid lg={5} className="text-right">
            <Icon
              className={`bg_${iconBgColor} t_white text-center`}
              n={icon}
              style={{
                width: 50,
                height: 50,
                lineHeight: `50px`,
                borderRadius: `50%`,
                fontSize: 24,
              }}
            />
          </Grid>
        </Grid>
        <hr />
        <Grid container alignItems="center">
          <Icon className="t_green mr5" n="long-arrow-alt-up" />
          <span className="t_green mr10">
            20.0%
          </span>
          <span>
           Since last month
          </span>
        </Grid>
      </Card>
    </Grid>
  );
};

export default class DashBoard extends React.PureComponent {
  state = {};

  saveRef = (ref) => (e) => (this[ref] = e);

  componentDidMount() {
    /** 用于让出 UI 线程 */
    setTimeout(() => this.chartDOM1.renderChart(), 15);
    setTimeout(() => this.chartDOM3.renderChart(), 45);
    setTimeout(() => this.chartDOM4.renderChart(), 60);
  }

  render() {
    return (
      <div className="dash-board">
        <Card container>
          <Grid
            container
            space={10}
            outSpacing={false}
          >
            <CardDesc
              icon="yen-sign"
              descTitle="Revenue"
              desc="1,000,000"
              actionText="查看"
              action={(e) => {

              }}
            />
            <CardDesc
              icon="users"
              iconBgColor="red"
              descTitle="Online user"
              desc="10,000"
              actionText="查看"
              action={(e) => {

              }}
            />
            <CardDesc
              icon="comments"
              iconBgColor="green"
              descTitle="Returned"
              desc="1,000"
              actionText="查看"
              action={(e) => {

              }}
            />
            <CardDesc
              icon="chart-line"
              iconBgColor="orange"
              descTitle="Performance"
              desc="80%"
              actionText="查看"
              action={(e) => {

              }}
            />
            <Grid
              xl={6}
              lg={6}
              md={12}
              sm={12}
              xs={12}
            >
              <Card className="relative" p={10}>
                <div className="mb10">Returned</div>
                <ChartCom
                  id="chartDOM4"
                  ref={this.saveRef("chartDOM4")}
                  height={200}
                  data={mockData}
                  type="pie"
                />
              </Card>
            </Grid>
            <Grid
              xl={6}
              lg={6}
              md={12}
              sm={12}
              xs={12}
            >
              <Card className="relative" p={10}>
                <div className="mb10">Revenue</div>
                <ChartCom
                  id="chartDOM3"
                  height={200}
                  ref={this.saveRef("chartDOM3")}
                  data={mockData}
                  type="radar"
                />
              </Card>
            </Grid>
            <Grid
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
            >
              <Card className="relative" p={10}>
                <div className="mb10">Fund</div>
                <ChartCom
                  id="chartDOM1"
                  height={240}
                  ref={this.saveRef("chartDOM1")}
                  data={mockData}
                  type="bar"
                />
              </Card>
            </Grid>
            <Grid
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
            >
              <Card className="relative" p={10}>
                <div className="mb10">Visitors</div>
                <MockVisitorTable />
              </Card>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}
