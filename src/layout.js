/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/withRouter';
import { ShowGlobalModal, Avatar } from 'ukelli-ui';
import Mousetrap from 'mousetrap';

import CacheRoute, {getPageCache, delPageCacheItem, getCurrPathname} from './cache-router';
import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';
import Posts from './posts';

const SAVE_TABS = 'save_tabs';

const selector = (name) => {
  return document.querySelector(name) || {};
}

class TabContent extends Component {
  state = {
    pageCententHeight: 200
  }
  constructor(props) {
    super(props);

    window.GetOutSideHeight = this.getOutSideHeight;
  }
  getOutSideHeight = () => {
    let statusBarHeight = selector('#statusBar').offsetHeight || 0;
    let pageRouterHeight = selector('#pageRouter').offsetHeight;

    return statusBarHeight + pageRouterHeight + 20;
  }
  setMainPageContentHeight() {
    let resultHeight = this.genPageContentHeight(this.getOutSideHeight());
    
    this.setState({
      pageCententHeight: resultHeight
    });

    window.GenPageCententHeight = (targetHeight) => {
      return this.genPageContentHeight(minuHeight + targetHeight);
    };
  }
  genPageContentHeight(targetHeight) {
    return `calc(100vh - ${targetHeight}px)`
  }
  componentDidMount() {
    this.setMainPageContentHeight();
    const { history } = this.props;
    let currPathname = getCurrPathname();
    // 绑定快捷键关闭标签页
    Mousetrap.bind(['alt+w'], e => {
      let routes = this.routes;
      const k = currPathname;
      routes = routes.filter(item => item != k);
      delPageCacheItem(k);
      history.replace(routes[routes.length - 1] || '/');
      return false;
    });

    // 重新挂载当前tab页
    Mousetrap.bind(['alt+r'], e => {
      let routes = this.routes;
      const k = currPathname;
      routes = routes.filter(item => item != k);
      delPageCacheItem(k);
      history.replace(routes[routes.length - 1] || '/');
      history.replace(k);
      return false;
    });

    // 保存当前打开的标签页
    Mousetrap.bind(['alt+a'], e => {
      if (this.routes.length < 1) return;
      const json = {
        routes: this.routes,
        pathname: currPathname
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
    const { history, iframeMode } = this.props;
    const { pageCententHeight } = this.state;

    let tabs = [];
    let tab_contents = [];
    let routes = [];
    let CACHE_PAGES = getPageCache();
    let currPathname = getCurrPathname();

    for (let k in CACHE_PAGES) {
      routes.push(k);
      let item = k.replace('/', '');
      tabs.push(
        <span
          key={k}
          className={'tab' + (currPathname == k ? ' active' : '')}>
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
              delPageCacheItem(k);
              history.replace(
                currPathname != k ? currPathname : routes[routes.length - 1] || '/'
              );
            }}>x</span>
        </span>
      );
      tab_contents.push(
        <div key={k}
          className={'content ' + (currPathname == k ? ' ' : 'hide ') + item}>
          {CACHE_PAGES[k]}
        </div>
      );
    }
    this.routes = routes;

    return (
      <React.Fragment>
        <div className="page-router" id="pageRouter">{tabs}</div>
        <div className="page-content" 
          style={{
            height: pageCententHeight
          }}
          id="pageCententContainer">{tab_contents}</div>
      </React.Fragment>
    );
  }
}

const TabContentWithRouter = withRouter(TabContent);

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
            <span className="show-nav-btn" onClick={e => this.toggleLeftMenu(true)}>展开</span>
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
              <TabContentWithRouter menuCodeMapper={menuCodeMapper} />
            ) : (
              <Posts {...this.props}/>
            )
          }
        </div>
      </div>
    );
  }
}
