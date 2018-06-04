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
          className={'tab' + (window.PATHNAME == k ? ' active' : '')}>
          <span
            className="text"
            onClick={e => {
              history.replace(k);
            }}>
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
            }}>x</span>
        </span>
      );
      tab_contents.push(
        <div key={k}
          className={'content ' + (window.PATHNAME == k ? ' ' : 'hide ') + item}>
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
      menuData: props.menuStore || []
    };
    let self = this;
    const { pageComponents } = props;

    this.pageRoutes = Object.keys(pageComponents);

    $GH.EventEmitter.subscribe('QUERY_MENU', ({detail}) => {
      self.changeMenuData(detail.res);
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
      userInfo = {},
      logout,
      pageComponents,
      HeaderPlugin,
      menuMappers
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
          onChangeMenu={code => {
            // this.pushRoute(code)
          }}
          menuMappers={menuMappers}
          flowMode={true}
          showLeftMenu={showLeftMenu}
          onToggleNav={toggle => {
            this.toggleLeftMenu(toggle);
          }}
          activeMenu={activeMenu}/>
        <div
          className={
            'pages-container ' + (showLeftMenu ? 'show-menu' : 'hide-menu')
          }>
          {
            HeaderPlugin ? (
              <HeaderPlugin
                onLogout={logout}
                displayFloat={displayFloat}
                userInfo={userInfo}
                toggleFloat={this.toggleFloat.bind(this)}/>
            ) : null
          }
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
  onLogout: PropTypes.func,
  headerPlugin: PropTypes.object,
  pageComponents: PropTypes.object.isRequired
};
