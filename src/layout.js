/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ShowGlobalModal, Avatar, Tabs, Tab } from 'ukelli-ui';
import Mousetrap from 'mousetrap';
import CacheRoute from './cache-router';

import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';
import Posts from './posts';

import TabContentWithRouter from './tab-content';

export default class ManagerLayout extends Component {
  static propTypes = {
    userInfo: PropTypes.object,
    onLogout: PropTypes.func,
    headerPlugin: PropTypes.object,
    iframeMode: PropTypes.bool,
    pageComponents: PropTypes.object
  };

  state = {
    menuCodeMapper: {},
    showLeftMenu: true,
    activeMenu: '',
    displayFloat: true,
    menuData: this.props.menuStore || []
  };

  constructor(props) {
    super(props);

    const { pageComponents, iframeMode } = props;
    this.pageRoutes = iframeMode ? ['Posts'] : Object.keys(pageComponents);
    $GH.EventEmitter.subscribe('QUERY_MENU', (resMenuData) => {
      this.changeMenuData(resMenuData);
    });
  }

  triggerResize() {
    setTimeout(() => {
      var evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);
    }, 50);
  }

  componentDidMount() {
    Mousetrap.bind(['ctrl ctrl', 'alt alt'], e => {
      this.toggleLeftMenu(!this.state.showLeftMenu);
      return false;
    });
    Mousetrap.bind(['alt+k'], e => this.showShortcut());
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+k', 'ctrl ctrl', 'alt alt']);
  }

  toggleFloat = () => {
    let isDisplay = $GH.ToggleBasicFloatLen();
    this.setState({
      displayFloat: !this.state.displayFloat
    });
  }

  changeRoute(route) {
    this.setState({
      activeMenu: route
    });
  }

  changeMenuData(menuData = []) {
    this.setState({
      menuData
    });
  }
  onGetMenuCodeMapper(menuCodeMapper) {
    this.setState({
      menuCodeMapper
    });
    window.MenuCodeMapper = menuCodeMapper;
  }
  toggleLeftMenu(showLeftMenu) {
    this.setState({
      showLeftMenu
    });
    this.triggerResize();
  }
  showShortcut = () => {
    ShowGlobalModal({
      children: <ShortcutHelp />,
      title: '键盘快捷键说明',
      width: 640
    });
  }
  render() {
    const {
      userInfo = {},
      logout,
      pageComponents,
      HeaderPlugin,
      menuMappers,
      versionInfo,
      iframeMode,
      multiplePage = true,
      title
    } = this.props;
    const {
      menuCodeMapper,
      showLeftMenu,
      menuData,
      activeMenu,
      displayFloat
    } = this.state;

    return (
      <div id="managerApp">
        <LeftmenuLayout
          onDidMount={this.onGetMenuCodeMapper.bind(this)}
          menuData={menuData}
          title={title}
          onChangeMenu={code => {
            // this.pushRoute(code)
          }}
          menuMappers={menuMappers}
          defaultFlowMode={false}
          versionInfo={versionInfo}
          showLeftMenu={showLeftMenu}
          onToggleNav={toggle => {
            this.toggleLeftMenu(toggle);
          }}
          activeMenu={activeMenu}/>
        {
          showLeftMenu ? null : (
            <span className="show-nav-btn" onClick={e => this.toggleLeftMenu(true)}>{'>'}</span>
          )
        }
        <div
          className={
            'pages-container ' + (showLeftMenu ? 'show-menu' : 'hide-menu')
          }>
          {
            HeaderPlugin ? (
              <div className="status-bar" id="statusBar">
                <HeaderPlugin
                  onLogout={logout}
                  showShortcut={this.showShortcut}
                  displayFloat={displayFloat}
                  userInfo={userInfo}
                  toggleFloat={this.toggleFloat}/>
              </div>
            ) : null
          }
          {
            !iframeMode ? this.pageRoutes.map((item, index) => {
              return (
                <CacheRoute
                  key={index}
                  path={'/' + item}
                  component={pageComponents[item]}
                />
              );
            }) : (
              // <Posts/>
              <span></span>
            )
          }
          {
            !iframeMode ? (
              <TabContentWithRouter multiple={multiplePage} menuCodeMapper={menuCodeMapper} />
            ) : (
              <Posts {...this.props}/>
            )
          }
        </div>
      </div>
    );
  }
}
