import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ScaffoldLayout from './layout';

const themeStrong = 'THEME_STORAGE';

export default class AdminWebScaffold extends Component {
  static propTypes = {
    /** 用户登录后的信息，会传递给每一个页面 */
    userInfo: PropTypes.shape({}),
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
    pageComponents: PropTypes.shape({}),
    /** 国际化配置 */
    i18nConfig: PropTypes.shape({}),
    /** 所有菜单的配置 */
    menuStore: PropTypes.arrayOf(PropTypes.object),
  };
  constructor(props) {
    super(props);
    this.state = {
      theme: window.Storage.getItem(themeStrong) || 'blue'
    };
  }
  changeTheme = (theme) => {
    this.setState({
      theme
    });
    window.Storage.setItem(themeStrong, theme);
  }
  render() {
    const { theme } = this.state;

    return (
      <div className={'top-lv-layout theme-' + theme}>
        <ScaffoldLayout {...this.props} changeTheme={this.changeTheme}/>
      </div>
    );
  }
}
