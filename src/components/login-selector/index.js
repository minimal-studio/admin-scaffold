import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import LoginPanelGenerator from './login-panel';

const autoLoginTokenMark = 'AUTO_LOGIN_SESSION';

export default class LoginSelector extends Component {
  constructor(props) {
    super(props);
    const self = this;

    let prevSess = this.getLoginSess();
    let defaultState = {
      networkStatus: 'NO_LOGIN_TOKEN',
      loading: false,
      userInfo: {},
      hasErr: false,
      resDesc: ''
    };
    if(prevSess) {
      defaultState.networkStatus = 'LOGIN_SUCCESS';
      defaultState.userInfo = prevSess.userInfo;
      onRequest.setPostHeader(prevSess.requestHeader);
    }

    this.state = defaultState;

    $GH.EventEmitter.subscribe('LOGIN_FAIL', () => {
      self.setState({
        networkStatus: 'FAIL'
      });
    });
  }
  setLoginSess(session) {
    sessionStorage.setItem(autoLoginTokenMark, JSON.stringify(session));
  }
  getLoginSess() {
    let sessionObj = null;
    try {
      sessionObj = JSON.parse(sessionStorage.getItem(autoLoginTokenMark));
    } catch (e) {}
    return sessionObj;
  }
  onLoginSuccess = ({requestHeader, userInfo, networkStatus, hasErr, resDesc}) => {
    this.setLoginSess({requestHeader, userInfo});
    this.setState({
      networkStatus, userInfo,
      hasErr, resDesc
    });
  }
  logout() {
    this.props.LoginActions.logout(() => {
      this.setState({
        networkStatus: 'NO_LOGIN_TOKEN',
        userInfo: {},
      });
      sessionStorage.clear();
    });
  }
  render() {
    const { children, LoginActions } = this.props;
    const { networkStatus, userInfo, loading } = this.state;

    let container;
    switch (networkStatus) {
      case 'LOGIN_SUCCESS':
        container = (
          <CSSTransition key="LOGIN_SUCCESS" classNames="fade" timeout={200}>
            {React.cloneElement(children, {
              userInfo: userInfo,
              onLogout: this.logout.bind(this),
              key: 'CONTAINER'
            })}
          </CSSTransition>
        );
        break;
      default:
        var LoginPanel = LoginPanelGenerator(LoginActions);
        container = (
          <CSSTransition key="login-panel" classNames="fade" timeout={200}>
            <LoginPanel
              {...this.state}
              onLoginSuccess={this.onLoginSuccess}/>
          </CSSTransition>
        );
    }
    return <TransitionGroup>{container}</TransitionGroup>;
  }
}

LoginSelector.propTypes = {
  LoginActions: PropTypes.func.isRequired,
};
