import React, { Component } from "react";
import {
  Grid, CardContainer, Card
} from "@deer-ui/core";

const AboutPage = () => (
  <div className="home-page">
    <CardContainer>
      <Grid container space={20} outSpacing={false}>
        <Grid item lg={6} sm={12} xs={12}>
          <Card p={20}>
            <h3>关于 @deer-ui/admin-dashboard</h3>
            <p>@deer-ui/admin-dashboard 是一个基于 React 的管理系统前端应用。</p>
            <p>
                应用于企业级管理系统前后端分离方案，适合多人团队协作开发。提供专注于业务逻辑声明式开发方式，提供功能齐全的模版引擎。
            </p>
          </Card>
        </Grid>
        <Grid item lg={6} sm={12} xs={12}>
          <Card p={20}>
            <h3>@deer-ui/core</h3>
            <p>
              @deer-ui/core 是基于 React 的可扩展的 UI 库，原子级构建方案。
            </p>
            <p />
          </Card>
        </Grid>
      </Grid>
    </CardContainer>
  </div>
);

export default AboutPage;
