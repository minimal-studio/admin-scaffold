import React, { Component } from "react";
import {
  Grid, CardContainer, Card
} from "@deer-ui/core";

const HomePage = () => (
  <div className="home-page">
    <CardContainer>
      <Grid container space={20} style={{ margin: -50 }}>
        <Grid item lg={6}>
          <Card p={20}>
            <h3>@deer-ui/admin-dashboard</h3>
            <p>@deer-ui/admin-dashboard 是一个基于 React 的管理系统前端应用。</p>
            <p>
                应用于企业级的管理系统，适合多人团队协作开发，完全的前后端分离。
            </p>
            <p>
                提供专注于业务的“声明式”开发方式、功能齐全的模版引擎(Template
                engin)。
            </p>
            <p>
                提供易于扩展的插件功能，提供开发约定，提高团队的开发效率，同时维持系统整体的统一性(开发方式，接入方式，UI交互，视觉效果等)。
            </p>
          </Card>
        </Grid>
        <Grid item lg={6}>
          <Card p={20}>
            <h3>@deer-ui/core</h3>
            <p>
                @deer-ui/core 是基于 React 的 UI
                库，提供简约和功能齐全的组件，可高度定制的组件接口，灵活的配置，提供给开发者另一种开发思路，也致力于尝试不同的组件使用和开发方向。
            </p>
            <p />
          </Card>
        </Grid>
      </Grid>
    </CardContainer>
  </div>
);

export default HomePage;
