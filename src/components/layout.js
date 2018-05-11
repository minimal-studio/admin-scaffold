/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/withRouter';
import { ShowGlobalModal, Avatar } from 'ukelli-ui';
import Mousetrap from 'mousetrap';

import Route from './cache-router';
import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';

const SAVE_TABS = 'save_tabs';

class TabContent extends Component {
  componentDidMount() {
    const { history } = this.props;
    // 绑定快捷键关闭标签页
    Mousetrap.bind(['alt+w'], e => {
      let routes = this.routes;
      const k = window.PATHNAME;
      routes = routes.filter(item => item != k);
      delete window.CACHE_PAGES[k];
      history.replace(routes[routes.length - 1] || '/');
      return false;
    });

    // 重新挂载当前tab页
    Mousetrap.bind(['alt+r'], e => {
      let routes = this.routes;
      const k = window.PATHNAME;
      routes = routes.filter(item => item != k);
      delete window.CACHE_PAGES[k];
      history.replace(routes[routes.length - 1] || '/');
      history.replace(k);
      return false;
    });

    // 保存当前打开的标签页
    Mousetrap.bind(['alt+a'], e => {
      if (this.routes.length < 1) return;
      const json = {
        routes: this.routes,
        pathname: window.PATHNAME
      };
      localStorage.setItem(SAVE_TABS, JSON.stringify(json));
      return false;
    });

    // 快捷打开保存的标签页
    Mousetrap.bind(['alt+o'], e => {
      const data = localStorage.getItem(SAVE_TABS);
      if (!data) return;
      const { routes, pathname } = JSON.parse(data);
      routes.forEach(path => {
        history.replace(path);
      });
      history.replace(pathname);
      return false;
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+w', 'alt+r', 'alt+o', 'alt+a']);
  }

  render() {
    const { history } = this.props;
    const tabs = [],
      tab_contents = [];
    let routes = [];
    for (let k in window.CACHE_PAGES) {
      routes.push(k);
      let item = k.replace('/', '');
      tabs.push(
        <span
          key={k}
          className={'tab' + (window.PATHNAME == k ? ' active' : '')}
        >
          <span
            className="text"
            onClick={e => {
              history.replace(k);
            }}
          >
            {this.props.menuCodeMapper[item] || item}
          </span>
          <span
            className="close-btn"
            onClick={e => {
              routes = routes.filter(item => item != k);
              delete window.CACHE_PAGES[k];
              history.replace(
                window.PATHNAME != k
                  ? window.PATHNAME
                  : routes[routes.length - 1] || '/'
              );
            }}
          >
            x
          </span>
        </span>
      );
      tab_contents.push(
        <div
          key={k}
          className={'content ' + (window.PATHNAME == k ? ' ' : 'hide ') + item}
        >
          {window.CACHE_PAGES[k]}
        </div>
      );
    }
    this.routes = routes;

    return (
      <div>
        <div className="page-router">{tabs}</div>
        <div className="page-content">{tab_contents}</div>
      </div>
    );
  }
}

const TabContentWithRouter = withRouter(TabContent);

export default class ManagerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuCodeMapper: {},
      showLeftMenu: true,
      activeMenu: '',
      displayFloat: true,
      menuData: props.userInfo.Menus.Child || []
    };
    let self = this;
    const { pageComponents } = props;

    this.pageRoutes = Object.keys(pageComponents);

    document.addEventListener('QUERY_MENU', e => {
      self.changeMenuData(e.detail.res);
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

  toggleFloat() {
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
  showShortcut() {
    ShowGlobalModal({
      children: <ShortcutHelp />,
      title: '键盘快捷键说明',
      width: 640
    });
  }
  render() {
    const {
      children,
      userInfo = {},
      changeTheme,
      onLogout,
      history,
      pageComponents,
      headerPlugin
    } = this.props;
    const {
      menuCodeMapper,
      showLeftMenu,
      menuData,
      activeMenu,
      displayFloat
    } = this.state;
    const { AdminName, GroupName, LastLoginTime, LoginTime } = userInfo;

    return (
      <div id="managerApp">
        <LeftmenuLayout
          onDidMount={this.onGetMenuCodeMapper.bind(this)}
          leftmenuData={menuData}
          onChangeMenu={code => {
            // this.pushRoute(code)
          }}
          userInfo={userInfo}
          flowMode={true}
          showLeftMenu={showLeftMenu}
          onToggleNav={toggle => {
            this.toggleLeftMenu(toggle);
          }}
          activeMenu={activeMenu}
        />
        <div
          className={
            'pages-container ' + (showLeftMenu ? 'show-menu' : 'hide-menu')
          }
        >
          <div className="status-bar">
            {headerPlugin}
            <span className="flex" />
            <div className="user-info-group hide-container">
              <div className="layout a-i-c user-info-item">
                <Avatar
                  size="sm"
                  changeAvatarable={false}
                  text={AdminName[0]}
                />
                <span className="ml10">{AdminName}</span>
              </div>
              <div className="hide-content">
                <div className="sub-menu">
                  <span
                    className="item-btn"
                    onClick={() => this.showShortcut()}
                    title="快捷键"
                  >
                    <i
                      className="fa fa-question-circle font-awesome"
                      aria-hidden="true"
                    />{' '}
                    快捷键
                  </span>
                  <span className="item-btn" onClick={e => this.toggleFloat()}>
                    {displayFloat ? '隐藏小数点' : '显示小数点'}
                  </span>
                  <a
                    className="item-btn hide-tip update-config-btn"
                    href={window.UPDATE_CLIENT_CONFIG_URL}
                    target="_blank"
                  >
                    更新客户端配置
                  </a>
                  <span className="item-btn">{GroupName}</span>
                  <span className="item-btn">
                    上次登录时间: <br />
                    {LastLoginTime}
                  </span>
                  <span className="item-btn" onClick={e => onLogout()}>
                    退出
                  </span>
                </div>
              </div>
            </div>
          </div>
          {this.pageRoutes.map((item, index) => {
            return (
              <Route
                key={index}
                path={'/' + item}
                component={pageComponents[item]}
              />
            );
          })}
          <TabContentWithRouter menuCodeMapper={menuCodeMapper} />
        </div>
      </div>
    );
  }
}
ManagerLayout.propTypes = {
  userInfo: PropTypes.object,
  changeTheme: PropTypes.func,
  onLogout: PropTypes.func,
  headerPlugin: PropTypes.object,
  pageComponents: PropTypes.object.isRequired
};
