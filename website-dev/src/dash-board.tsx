import React, { Component } from "react";

import {
  Grid, Card, CardContainer, Label
} from "@deer-ui/core";
import {
  ChartCom
} from "@deer-ui/enhance-ui";

ChartCom.setChartJSPath(
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.bundle.min.js"
);

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

export default class DashBoard extends React.PureComponent {
  state = {};

  saveRef = (ref) => (e) => (this[ref] = e);

  componentDidMount() {
    /** 用于让出 UI 线程 */
    setTimeout(() => this.chartDOM1.renderChart(), 15);
    setTimeout(() => this.chartDOM2.renderChart(), 30);
    setTimeout(() => this.chartDOM3.renderChart(), 45);
    setTimeout(() => this.chartDOM4.renderChart(), 60);
  }

  render() {
    return (
      <div className="dash-board">
        <CardContainer>
          <Card p={20}>
            统计数据： 在线{" "}
            <Label color="red">{(1000000).toLocaleString("en-US")}</Label> 人
          </Card>
          <Grid
            container
            space={10}
            style={{
              margin: -20
            }}>
            <Grid xl={12} lg={12} />
            <Grid xl={4} lg={6} md={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">数据1</h3>
                <ChartCom
                  id="chartDOM1"
                  ref={this.saveRef("chartDOM1")}
                  data={mockData}
                  type="bar"
                  options={options}/>
              </Card>
            </Grid>
            <Grid xl={4} lg={6} md={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">数据2</h3>
                <ChartCom
                  id="chartDOM2"
                  ref={this.saveRef("chartDOM2")}
                  data={mockData}
                  type="line"
                  options={options}/>
              </Card>
            </Grid>
            <Grid xl={4} lg={6} md={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">数据3</h3>
                <ChartCom
                  id="chartDOM3"
                  ref={this.saveRef("chartDOM3")}
                  data={mockData}
                  type="radar"
                  options={options}/>
              </Card>
            </Grid>
            <Grid xl={4} lg={6} md={12}>
              <Card className="relative" p={10}>
                <h3 className="text-center">数据4</h3>
                <ChartCom
                  id="chartDOM4"
                  ref={this.saveRef("chartDOM4")}
                  data={mockData}
                  type="pie"
                  options={options}/>
              </Card>
            </Grid>
          </Grid>
        </CardContainer>
      </div>
    );
  }
}
