import React, { SFC } from 'react';
import { Call, IsFunc } from '@mini-code/base-func';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Children } from '@deer-ui/core/utils';
import LoginPanel, { LoginPanelProps } from './login-panel';

export interface LoginSelectorProps extends LoginPanelProps {
  isLogin: boolean;
  didMount: () => void;
  children: Children;
}

const LoginSelector: SFC<LoginSelectorProps> = (props) => {
  const { children, isLogin } = props;

  let container;
  switch (true) {
    case isLogin:
      container = IsFunc(children) ? children(props) : children;
      break;
    default:
      container = (
        <LoginPanel
          {...props}/>
      );
  }
  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={isLogin ? 'LOGIN_SUCCESS' : 'NO_LOGIN_YET'}
        classNames="fade"
        timeout={200}>
        {container}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default LoginSelector;
