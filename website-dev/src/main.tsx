/**
 * Author: Alex Zhang
 * Desc: 此文件为生成环境的主要入口文件
 */

import React from "react";
import { Provider, connect } from "unistore/react";
import { hot } from "react-hot-loader";

import { Call, DateFormat } from "@mini-code/base-func";

/**
 * 通用代码块
 */

import { AdminWebScaffold } from "@deer-ui/admin-scaffold";
import { AuthSelector } from "@deer-ui/admin-scaffold/auth-selector";

import { authStore, authActions } from "@dashboard/auth/actions";
import * as AllManagerPages from "@dashboard/pages";
import "@dashboard/config/app-config";

import VersionInfo from "./version.json";
import DashBoard from "./dash-board";
import statusbarConfig from "./statusbar-config";

/**
 * 样式文件
 */
import "./app.scss";

const pageComponents = { ...AllManagerPages, DashBoard };

const defaultLang = navigator.language || navigator.userLanguage;

const i18nConfig = {
  "zh-CN": "中文",
  "en-US": "English"
};

function selector(state) {
  return state;
}

const Status = ({ onLogout }) => (
  <React.Fragment>
    <span className="flex" />
    {/* <div className="actions mr10">
        <span className="_btn" onClick={e => onLogout()}>退出登录</span>
      </div> */}
  </React.Fragment>
);

const loginFormOptions = [
  {
    ref: "AdminName",
    type: "input",
    title: "账号",
    iconName: "account",
    required: true
  },
  {
    ref: "Password",
    type: "password",
    title: "密码",
    iconName: "lock",
    required: true
  },
  {
    ref: "GooglePassword",
    type: "input",
    iconName: "security",
    title: "Google认证码"
  }
];

const Footer = () => {
  const today = new Date();
  return (
    <div className="mr10">
      <span className="mr10">
        © {DateFormat(today, "YYYY")}, Made by{" "}
        <a href="https://github.com/SANGET" target="_blank">
          SANGET
        </a>
        ,{" "}
      </span>
      <a
        href="https://github.com/SANGET/@deer-ui/admin-scaffold"
        target="_blank"
        className="item mr10">
        Github
      </a>
      <a href="https://thinkmore.xyz" target="_blank" className="item mr10">
        Blog
      </a>
      <a href="https://thinkmore.xyz" target="_blank" className="item mr10">
        About
      </a>
    </div>
  );
};

const removeLoadingBG = () => {
  const loaderDOM = document.querySelector("#loadingBg");
  if (!loaderDOM || !loaderDOM.parentNode) return;
  loaderDOM.classList.add("loaded");
  loaderDOM.parentNode.removeChild(loaderDOM);
  // setTimeout(() => {
  // }, 100);
};

class LoginFilter extends React.Component {
  componentDidMount() {
    // this.props.autoLogin();
    // Call(window.OnLuanched);
    removeLoadingBG();
  }

  render() {
    const { isLogin, userInfo } = this.props;
    // isLogin = process.env.NODE_ENV === "development" ? true : isLogin;
    return (
      <AuthSelector
        {...this.props}
        backgroundImage="url(./images/bg/bg_3.jpg)"
        btnGColor="red"
        logo={() => <h3>@deer-ui/admin-dashboard</h3>}
        isLogin={isLogin}
        formOptions={loginFormOptions}>
        {isLogin ? (
          <AdminWebScaffold
            versionUrl="./version.json"
            {...this.props}
            // 必须填写的
            bgStyle={
              {
                // background: `url(./images/bg/bg_1.jpg)`,
                // backgroundColor: '#f3f3f3',
                // opacity: 0.1
              }
            }
            username={userInfo.username}
            statusbarConfig={statusbarConfig}
            versionInfo={VersionInfo}
            menuMappers={{
              child: "child",
              code: "code",
              title: "title",
              icon: "icon"
            }}
            title="@deer-ui/admin-dashboard"
            i18nConfig={i18nConfig}
            pluginComponent={{
              Statusbar: Status,
              DashBoard,
              Footer
            }}
            pageComponents={pageComponents}/>
        ) : null}
      </AuthSelector>
    );
  }
}
const LoginFilterWithStore = connect(
  selector,
  authActions
)((userStore) => <LoginFilter {...userStore} />);

const C = () => (
  <Provider store={authStore}>
    <LoginFilterWithStore />
  </Provider>
);

export default hot(module)(C);
