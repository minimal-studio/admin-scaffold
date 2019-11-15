/**
 * Author: Alex
 * CreateDate: Fri Sep 07 2018 12:14:44
 * PageName: test-link
 * Alias: 测试link
 */

import React, { Component } from "react";
import { TipPanel } from "@deer-ui/core";
import { Link } from "@deer-ui/admin-scaffold";

import { Services } from "@dashboard/services";

class TestLink extends Services {
  render() {
    const { routerParams } = this;
    const { history, onNavigate } = this.props;
    const { location } = history;
    // console.log(location.state)
    return (
      <div className="card-content">
        <TipPanel
          title="说明"
          texts={[
            `为了解决 React Router 不支持多标签页同时存在的问题`,
            "@deer-ui/admin-dashboard 提供有一种管理 router 的机制",
            "其他组件可以通过 Link 标签打开对应的路由，并且通过 url 传递参数，同时设置 history 的 state"
          ]}/>
        <div className="p10">
          <span>路由结果: {JSON.stringify(routerParams)}</span>
          <div>
            <span
              className="link-btn"
              onClick={(e) => onNavigate({
                type: "GO_BACK"
              })
              }>
              返回上一层
            </span>
          </div>
          <Link to="HomePage">首页</Link>
        </div>
      </div>
    );
  }
}

export { TestLink };
