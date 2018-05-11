import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HashRouter from 'react-router-dom/HashRouter';
import withRouter from 'react-router/withRouter';
import LoginSelector from './login-selector';

import ManagerLayout from './layout';
export const ManagerLayoutWithRouter = withRouter(ManagerLayout);

const themeStrong = 'THEME_STORAGE';

export default class ManagerApp extends Component {
  constructor() {
    super();
    this.state = {
      theme: window.Storage.getItem(themeStrong) || 'blue'
    };
  }
  componentDidMount() {
    let loaderDOM = document.querySelector('#loadingBg');
    loaderDOM.classList.add('loaded');
    setTimeout(() => {
      document.body.removeChild(loaderDOM);
    }, 1000);
  }
  changeTheme(theme) {
    this.setState({
      theme
    });
    window.Storage.setItem(themeStrong, theme);
  }
  render() {
    const { location, routes, pageComponents, LoginActions } = this.props;
    const { theme } = this.state;

    return (
      <HashRouter>
        <div className={'top-lv-layout theme-' + theme}>
          <LoginSelector LoginActions={LoginActions}>
            <ManagerLayoutWithRouter
              {...this.props}
              changeTheme={this.changeTheme.bind(this)}
            />
          </LoginSelector>
        </div>
      </HashRouter>
    );
  }
}
ManagerApp.propTypes = {
  pageComponents: PropTypes.object.isRequired,
  LoginActions: PropTypes.func.isRequired,
  headerPlugin: PropTypes.object
};
