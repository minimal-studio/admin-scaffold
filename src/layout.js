/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Mousetrap from 'mousetrap';
import { ToggleBasicFloatLen, EventEmitter, IsFunc } from 'basic-helper';

import {
  ShowModal, Tabs, Tab, DropdownMenu, ToolTip,
  Loading, setUkelliConfig, setUkeLang
} from './ui-refs';

import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';
// import Posts from './posts';
import Notfound from './notfound';
import { RouterHelper } from './router-multiple';
import DashBoardWrapper from './dash-board';
import VersionComponent from './version-com';

let i18nMapperUrl = './i18n/';

export default class ScaffoldLayout extends RouterHelper {
  static setI18nUrl = (nextUrl) => {
    i18nMapperUrl = nextUrl;
  }
  static propTypes = {
    /** 用户登录后的信息，会传递给每一个页面 */
    userInfo: PropTypes.object,
    /** 用户名，用于在左菜单显示 */
    username: PropTypes.string.isRequired,
    /** 退出登录 */
    onLogout: PropTypes.func,
    /** 插件管理 */
    pluginComponent: PropTypes.shape({
      /** 顶部状态栏插件 */
      Statusbar: PropTypes.any,
      /** DashBoard 插件 */
      DashBoard: PropTypes.any,
      /** 404 页面插件 */
      NotfoundPage: PropTypes.any,
    }),
    // iframeMode: PropTypes.bool,
    /** 所有的页面的 mapper 引用 */
    pageComponents: PropTypes.object,
    /** 传给所有页面的 props */
    pageProps: PropTypes.object,
    /** 国际化配置 */
    i18nConfig: PropTypes.object,
    /** 最大存在的 tab 路由 */
    maxRouters: PropTypes.number,
    bgStyle: PropTypes.object,
    /** 所有菜单的配置 */
    menuStore: PropTypes.arrayOf(PropTypes.object),
    /** DashBoard 插件 */
    // DashBoard: PropTypes.any,
  };
  
  static defaultProps = {
    bgStyle: {},
    maxRouters: 10
  }

  state = {
    ...this.state,
    menuCodeMapper: {},
    showLeftMenu: true,
    activeMenu: '',
    displayFloat: true,
    menuData: this.props.menuStore || [],
    lang: navigator.language,
    ready: false,
    langMapper: {}
  };

  constructor(props) {
    super(props);

    const { pageComponents, iframeMode } = props;
    this.pageRoutes = iframeMode ? ['Posts'] : Object.keys(pageComponents);
    EventEmitter.on('QUERY_MENU', (resMenuData) => {
      this.changeMenuData(resMenuData);
    });
    this.initApp();
  }

  async initApp() {
    let langMapper = await this.fetchLangMapper(this.state.lang);
    this.setState({
      langMapper,
      ready: true
    });
  }

  geti18nUrl(lang) {
    return i18nMapperUrl + lang + '.json';
  }

  changeLang = async (lang) => {
    if(!lang) return;
    let langMapper = await this.fetchLangMapper(lang);
    this.setState({
      lang,
      langMapper
    });
  }

  fetchLangMapper = async (lang) => {
    let url = this.geti18nUrl(lang);
    try {
      let mapper = await (await fetch(url)).json();
      setUkelliConfig({
        getKeyMap: this.gm,
      });
      setUkeLang(lang);
      return mapper;
    } catch(e) {
      console.log('please set the correct i18n url');
      return {};
    }
    // setState && this.setState({
    //   langMapper: mapper
    // });
    // 设置 UI 库的 keyMapper
  }

  gm = (key) => {
    let keyMapper = this.state.langMapper;
    return key === 'all' ? keyMapper : keyMapper[key] || key || '';
  }

  triggerResize() {
    setTimeout(() => {
      var evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);
    }, 50);
  }

  componentDidMount() {
    Mousetrap.bind(['alt alt'], e => {
      this.toggleLeftMenu(!this.state.showLeftMenu);
      return false;
    });
    Mousetrap.bind(['alt+k'], e => this.showShortcut());
    Mousetrap.bind(['alt+w'], e => this.handleCloseFormShortcut());
    this.initRoute();
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+k', 'alt alt']);
  }

  handleCloseFormShortcut = () => {
    const { activeRouteIdx, routerInfo } = this.state;
    this.closeTab(activeRouteIdx, routerInfo);
  }

  toggleFloat = () => {
    let isDisplay = ToggleBasicFloatLen();
    this.setState(({ displayFloat }) => ({
      displayFloat: !displayFloat
    }));
  }

  changeMenuData(menuData = []) {
    this.setState({
      menuData
    });
  }
  onGetMenuCodeMapper = (menuCodeMapper) => {
    this.setState({
      menuCodeMapper
    });
    window.MenuCodeMapper = menuCodeMapper;
  }
  toggleLeftMenu = (showLeftMenu) => {
    this.setState({
      showLeftMenu
    });
    this.triggerResize();
  }
  showShortcut = () => {
    ShowModal({
      children: <ShortcutHelp/>,
      title: '键盘快捷键说明',
      width: 640
    });
  }
  getRouteProps(isActive) {
    const { userInfo, username, pageProps } = this.props;
    return {
      ...pageProps,
      userInfo,
      username,
      isActive,
      gm: this.gm,
      onNavigate: this.onNavigate,
      history: this.history,
    };
  }
  loadPlugin = (Plugin, props) => {
    let P = IsFunc(Plugin) ? <Plugin /> : Plugin;

    P = React.cloneElement(P, props);

    return P;
  }
  render() {
    const {
      username = 'U',
      logout,
      pageComponents,
      pluginComponent = {},
      menuMappers,
      versionInfo,
      iframeMode,
      i18nConfig,
      // DashBoard,
      bgStyle,
      title
    } = this.props;
    const {
      menuCodeMapper,
      showLeftMenu,
      menuData,
      activeMenu,
      displayFloat,
      activeRouteIdx,
      routerInfo,
      lang,
      ready,
      routers
    } = this.state;
    const { Statusbar, NotfoundPage, DashBoard = this.props.DashBoard } = pluginComponent;
    const hasRouter = routers.length > 0;

    return (
      <div id="managerApp" className="fill main-container fixbg">
        <Loading loading={!ready}>
          {
            ready && (
              <div>
                <LeftmenuLayout
                  onDidMount={this.onGetMenuCodeMapper}
                  menuData={menuData}
                  title={title}
                  logout={logout}
                  // onClickMenu={code => {
                  //   // this.pushRoute(code)
                  // }}
                  i18nConfig={i18nConfig}
                  menuMappers={menuMappers}
                  username={username}
                  lang={lang}
                  defaultFlowMode={false}
                  changeLang={this.changeLang}
                  showLeftMenu={showLeftMenu}
                  gm={this.gm}
                  onToggleNav={this.toggleLeftMenu}
                  activeMenu={activeMenu}/>
                {/* {
                  showLeftMenu ? null : (
                    <span className="show-nav-btn" onClick={e => this.toggleLeftMenu(true)}>
                      <Icon n="angle-right"/>
                    </span>
                  )
                } */}
                <div
                  className={
                    'pages-container ' + (showLeftMenu ? 'show-menu' : 'hide-menu')
                  }>
                  <div className="uke-status-bar" id="statusBar">
                    <div className="menu-actions">
                      <span
                        className="_action-btn mr10"
                        onClick={e => this.toggleLeftMenu(!showLeftMenu)}>
                        <ToolTip
                          title={this.gm(showLeftMenu ? "收起" : "展开") + '菜单（快捷键：alt + alt）'}
                          n={showLeftMenu ? "angle-double-left" : "angle-double-right"}/>
                      </span>
                    </div>
                    {
                      Statusbar ? this.loadPlugin(Statusbar, {
                        onLogout: logout,
                        showShortcut: this.showShortcut,
                        displayFloat: displayFloat,
                        gm: this.gm,
                        toggleFloat: this.toggleFloat,
                      }) : null
                    }
                    {
                      i18nConfig ? (
                        <div className="lang-selector mr10">
                          <DropdownMenu 
                            onChange={val => this.changeLang(val)}
                            position="right"
                            value={lang}
                            values={i18nConfig}/>
                        </div>
                      ) : null
                    }
                  </div>
                  <Tabs 
                    withContent 
                    closeabled={hasRouter}
                    closeTip="快捷键: alt + w"
                    className="top-tab-wrapper tabs-container"
                    activeTabIdx={hasRouter ? activeRouteIdx : 0}
                    onClose={idx => this.closeTab(idx, routerInfo)}>
                    {
                      hasRouter ? routers.map((route, idx) => {
                        const C = pageComponents[route];
                        const currInfo = routerInfo[route];
                        const { params } = currInfo;
                        const key = route + JSON.stringify(params);
                        const isActive = activeRouteIdx === idx;
                        return (
                          <Tab 
                            contentClass={route}
                            label={this.gm(menuCodeMapper[route] || route)} 
                            key={key} 
                            onChange={e => this.changeRoute(route, params)}>
                            {
                              C ? (
                                <C {...this.getRouteProps(isActive)}/>
                              ) : NotfoundPage ? this.loadPlugin(NotfoundPage) : (
                                <Notfound key={route + '404'}/>
                              )
                            }
                          </Tab>
                        );
                      }) : (
                        <Tab
                          contentClass="dash-board"
                          label={this.gm("仪表盘")}
                          key="dash-board">
                          <DashBoardWrapper
                            CustomerComponent={DashBoard} loadPlugin={this.loadPlugin} {...this.getRouteProps(true)} />
                        </Tab>
                      )
                    }
                  </Tabs>
                </div>
                {
                  versionInfo ? (
                    <VersionComponent gm={this.gm} versionInfo={versionInfo} />
                  ) : null
                }
              </div>
            )
          }
        </Loading>
        <div className="fill fixbg main-bg-color" style={{
          ...bgStyle,
          zIndex: -1
        }} />
      </div>
    );
  }
}
