import React, { Component } from "react";
import { Link } from '@deer-ui/admin-scaffold';

import {
  Grid, Card, Label, Icon, Button
} from "@deer-ui/core";
import {
  ChartCom
} from "@deer-ui/enhance-ui";
import { onNavigate } from "@deer-ui/admin-scaffold/router-multiple";

// ChartCom.setChartJSPath(
//   "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js"
// );

const mockData = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
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
  action, actionText
}) => {
  return (
    <Card p={10} className="_btn">
      <Grid container alignItems="center">
        <Grid lg={5}>
          <Icon
            n={icon}
            style={{
              padding: `15px`,
              fontSize: 50,
              color: '#CCC'
            }}
          />
        </Grid>
        <Grid lg={7}>
          <div className="text-right">
            <h4 style={{ marginTop: 0 }}>{descTitle}</h4>
            <Label color="red" style={{
              // fontSize: 18
            }}
            >{desc}</Label>
          </div>
        </Grid>
      </Grid>
      {/* <hr /> */}
      {/* <Button
        block
        hola
        onClick={(e) => {
          action();
          onNavigate({
            route: 'LayoutDemo'
          });
        }}
      >
        {actionText}
      </Button> */}
    </Card>
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
          >
            <Grid
              xl={3}
              lg={3}
              md={3}
              sm={6}
              xs={6}
            >
              <CardDesc
                icon="yen-sign"
                descTitle="营收"
                desc="10,000,000"
                actionText="查看"
                action={(e) => {

                }}
              />
            </Grid>
            <Grid
              xl={3}
              lg={3}
              md={3}
              sm={6}
              xs={6}
            >
              <CardDesc
                icon="users"
                descTitle="在线人数"
                desc="10,000"
                actionText="查看"
                action={(e) => {

                }}
              />
            </Grid>
            <Grid
              xl={3}
              lg={3}
              md={3}
              sm={6}
              xs={6}
            >
              <CardDesc
                icon="comments"
                descTitle="反馈"
                desc="1,000"
                actionText="查看"
                action={(e) => {

                }}
              />
            </Grid>
            <Grid
              xl={3}
              lg={3}
              md={3}
              sm={6}
              xs={6}
            >
              <CardDesc
                icon="chart-line"
                descTitle="转化率"
                desc="80%"
                actionText="查看"
                action={(e) => {

                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            space={10}
          >
            <Grid xl={4} lg={6} md={6} sm={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">负债</h3>
                <ChartCom
                  id="chartDOM1"
                  ref={this.saveRef("chartDOM1")}
                  data={mockData}
                  type="bar"
                  options={options}
                />
              </Card>
            </Grid>
            <Grid xl={4} lg={6} md={6} sm={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">营收</h3>
                <ChartCom
                  id="chartDOM3"
                  ref={this.saveRef("chartDOM3")}
                  data={mockData}
                  type="radar"
                  options={options}
                />
              </Card>
            </Grid>
            <Grid xl={4} lg={6} md={6} sm={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">支出</h3>
                <ChartCom
                  id="chartDOM4"
                  ref={this.saveRef("chartDOM4")}
                  data={mockData}
                  type="pie"
                  options={options}
                />
              </Card>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}
