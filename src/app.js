import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HashRouter from 'react-router-dom/HashRouter';
import withRouter from 'react-router/withRouter';

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
  changeTheme(theme) {
    this.setState({
      theme
    });
    window.Storage.setItem(themeStrong, theme);
  }
  render() {
    const { location, routes, pageComponents } = this.props;
    const { theme } = this.state;

    return (
      <HashRouter>
        <div className={'top-lv-layout theme-' + theme}>
          <ManagerLayoutWithRouter
            {...this.props}
            changeTheme={this.changeTheme.bind(this)}
          />
        </div>
      </HashRouter>
    );
  }
}
ManagerApp.propTypes = {
  pageComponents: PropTypes.object.isRequired,
  HeaderPlugin: PropTypes.func
};
