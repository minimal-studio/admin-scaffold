import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ScaffoldLayout from './layout';

const themeStrong = 'THEME_STORAGE';

export default class AdminWevScaffold extends Component {
  static propTypes = {
    /** 用户登录后的信息，会传递给每一个页面 */
    userInfo: PropTypes.object,
    /** 用户名，用于在左菜单显示 */
    username: PropTypes.string.isRequired,
    /** 退出登录 */
    onLogout: PropTypes.func,
    /** 插件管理 */
    pluginComponent: PropTypes.shape({
      Statusbar: PropTypes.any
    }),
    // iframeMode: PropTypes.bool,
    /** 所有的页面的 mapper 引用 */
    pageComponents: PropTypes.object,
    /** 国际化配置 */
    i18nConfig: PropTypes.object,
    /** 所有菜单的配置 */
    menuStore: PropTypes.arrayOf(PropTypes.object),
    /** DashBoard 插件 */
    DashBoard: PropTypes.any,
  };
  constructor(props) {
    super(props);
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
    const { theme } = this.state;

    return (
      <div className={'top-lv-layout theme-' + theme}>
        <ScaffoldLayout {...this.props} changeTheme={this.changeTheme.bind(this)}/>
      </div>
    );
  }
}
