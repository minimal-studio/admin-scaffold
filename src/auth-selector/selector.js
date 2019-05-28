import React from 'react';
import PropTypes from 'prop-types';
import { Call, IsFunc } from 'basic-helper';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import LoginPanel from './login-panel';

const removeLoadingBG = () => {
  let loaderDOM = document.querySelector('#loadingBg');
  if(!loaderDOM || !loaderDOM.parentNode) return;
  loaderDOM.classList.add('loaded');
  loaderDOM.parentNode.removeChild(loaderDOM);
  // setTimeout(() => {
  // }, 100);
};

const LoginSelector = (props) => {
  const { children, isLogin } = props;

  let container;
  switch (true) {
  case isLogin:
    container = IsFunc(children) ? children(props) : children;
    break;
  // case autoLoging:
  //   container = (
  //     <div className="auto-loging-tip">自动登陆中，请稍后...</div>
  //   );
  //   break;
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

LoginSelector.propTypes = {
  isLogin: PropTypes.bool,
  didMount: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]),
};

export default LoginSelector;