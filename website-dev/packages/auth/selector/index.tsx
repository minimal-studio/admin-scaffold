import React, { Component } from "react";

import { TransitionGroup, CSSTransition } from "react-transition-group";

import LoginPanel from "./login-panel";

const LoginSelector = (props) => {
  const { children, isLogin } = props;

  let container;
  switch (true) {
    case isLogin:
      container = React.cloneElement(children, props);
      break;
    default:
      container = <LoginPanel {...props} />;
  }
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={isLogin ? "LOGIN_SUCCESS" : "NO_LOGIN_YET"}
        classNames="fade"
        timeout={200}
      >
        {container}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default LoginSelector;
