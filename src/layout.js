/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Mousetrap from 'mousetrap';
import { ToggleBasicFloatLen, EventEmitter, IsFunc } from 'basic-helper';
import classnames from 'classnames';

import {
  ShowModal, Tabs, Tab, DropdownMenu, ToolTip,
  Loading, setUkeLang, Icon, setLangTranslate
} from './ui-refs';

import { showShortcut, ShortcutDesc } from './shortcut';
import NavMenu from './nav-menu';
// import Posts from './posts';
import { RouterHelper } from './router-multiple';
import VersionComponent, { VersionChecker } from './plugins/version-com';
import {
  Notfound, DashBoardWrapper, DefaultStatusbar, FooterContainer, TabForNavBar, Theme
} from './plugins';
import {
  getThemeConfig, setTheme, setLayout, setDarkMode
} from './plugins/theme';

let i18nMapperUrl = './i18n/';
let LANG_MAPPER = {};
let CURR_LANG_MAPPER = {};

export default class ScaffoldLayout extends RouterHelper {
  static setI18nUrl = (nextUrl) => {
    i18nMapperUrl = nextUrl;
  }
  static propTypes = {
    /** 用户登录后的信息，会传递给每一个页面 */
    userInfo: PropTypes.shape({}),
    /** 用户名，用于在左菜单显示 */
    username: PropTypes.string.isRequired,
    /** 版本号文件的路径 */
    versionUrl: PropTypes.string,
    /** 退出登录 */
    onLogout: PropTypes.func,
    /** 导航栏的配置 */
    statusbarConfig: PropTypes.arrayOf(
      PropTypes.shape({
        /** 显示的 title */
        title: PropTypes.string,
        /** icon */
        icon: PropTypes.string,
        /** PureIcon */
        pureIcon: PropTypes.string,
        /** 传入 DropdownWrapper 的 children */
        children: PropTypes.func,
        /** 如果有 component，则直接替换 DropdownWrapper */
        component: PropTypes.any,
        /** 如果有 action，则直接显示内容，并且触发 action */
        action: PropTypes.any,
      })
    ),
    /** 插件管理 */
    pluginComponent: PropTypes.shape({
      /** 顶部状态栏插件 */
      Statusbar: PropTypes.any,
      /** DashBoard 插件 */
      DashBoard: PropTypes.any,
      /** 404 页面插件 */
      NotfoundPage: PropTypes.any,
      /** Footer 插件 */
      Footer: PropTypes.any,
    }),
    /** 默认主题 */
    defaultTheme: PropTypes.oneOf([
      'blue', 'red', 'green', 'yellow', 'light-p', 'gold', 'orange', 'wine'
    ]),
    /** 默认布局方式 */
    defaultLayout: PropTypes.oneOf([
      'vertical', 'horizontal'
    ]),
    /** 是否黑夜模式 */
    defaultDarkMode: PropTypes.bool,
    // iframeMode: PropTypes.bool,
    /** 所有的页面的 mapper 引用 */
    pageComponents: PropTypes.shape({}),
    /** 传给所有页面的 props */
    pageProps: PropTypes.shape({}),
    /** 国际化配置 */
    i18nConfig: PropTypes.shape({}),
    /** 国际化 Mapper */
    i18nMapper: PropTypes.shape({}),
    /** 最大存在的 tab 路由 */
    maxRouters: PropTypes.number,
    /** 顶级 tab 是否在 statusbar 中 */
    tabInStatusbar: PropTypes.bool,
    /** 是否缓存 state */
    cacheState: PropTypes.bool,
    /** 背景 */
    bgStyle: PropTypes.shape({}),
    /** 所有菜单的配置 */
    menuStore: PropTypes.arrayOf(PropTypes.shape({})),
    /** 菜单的字段映射 */
    menuMappers: PropTypes.shape({
      child: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      pureIcon: PropTypes.string,
    }),
    /** DashBoard 插件 */
    // DashBoard: PropTypes.any,
  };
  
  static defaultProps = {
    bgStyle: {},
    maxRouters: 10,
    defaultTheme: 'blue',
    defaultLayout: 'horizontal',
    versionUrl: './js/version.json',
    defaultDarkMode: false,
    statusbarConfig: [],
    tabInStatusbar: true,
    cacheState: true,
  }

  constructor(props) {
    super(props);

    // const { pageComponents, iframeMode } = props;
    // this.pageRoutes = iframeMode ? ['Posts'] : Object.keys(pageComponents);
    // EventEmitter.on('QUERY_MENU', (resMenuData) => {
    //   this.changeMenuData(resMenuData);
    // });

    this.state = {
      ...this.state,
      ...this.initThemeConfig(),
      menuCodeMapper: {},
      showNavMenu: true,
      activeMenu: '',
      displayFloat: true,
      menuData: props.menuStore || [],
      lang: navigator.language,
      ready: false,
    };
    this.initApp();
  }

  initThemeConfig = () => {
    // const THEME = Storage.getItem()
    const themeConfig = getThemeConfig();
    return Object.assign({}, {
      theme: this.props.defaultTheme,
      darkMode: this.props.defaultDarkMode,
      layout: this.props.defaultLayout,
    }, themeConfig);
  }

  geti18nUrl(lang) {
    return i18nMapperUrl + lang + '.json';
  }

  async initApp() {
    const { i18nMapper } = this.props;
    const { lang } = this.state;
    if(i18nMapper) {
      LANG_MAPPER = {...i18nMapper};
    }
    await this.fetchLangMapper(lang);
    this.setUILang(lang);
    this.setState({
      ready: true
    });
  }

  changeLang = async (lang) => {
    if(!lang) return;
    await this.fetchLangMapper(lang);
    this.setUILang(lang);
    this.setState({
      lang,
    });
  }

  setUILang = (lang) => {
    /** 设置 UI 库的国际化 */
    // setLangTranslate({
    //   [lang]: LANG_MAPPER[lang]
    // });
    CURR_LANG_MAPPER = LANG_MAPPER[lang];
    setLangTranslate(LANG_MAPPER);
    setUkeLang(lang);
  }

  changeTheme = (nextTheme) => {
    this.setState({
      theme: nextTheme,
    });
    setTheme(nextTheme);
  }

  changeDarkMode = (nextDarkMode) => {
    this.setState({
      darkMode: nextDarkMode,
    });
    setDarkMode(nextDarkMode);
  }

  changeLayout = (nextLayout) => {
    this.setState({
      layout: nextLayout,
    });
    setLayout(nextLayout);
  }

  fetchLangMapper = async (lang) => {
    let url = this.geti18nUrl(lang);
    try {
      let mapper = await (await fetch(url)).json();
      Object.assign(LANG_MAPPER[lang], mapper);
      return mapper;
    } catch(e) {
      console.log('please set the correct i18n url');
      return {};
    }
    // setState && this.setState({
    //   LANG_MAPPER: mapper
    // });
    // 设置 UI 库的 keyMapper
  }

  $T = (key) => {
    return key === 'all' ? CURR_LANG_MAPPER : CURR_LANG_MAPPER[key] || key || '';
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
      this.toggleNavMenu(!this.state.showNavMenu);
      return false;
    });
    Mousetrap.bind(['alt+k'], e => showShortcut());
    Mousetrap.bind(['alt+w'], e => this.handleCloseFormShortcut());
    this.initRoute();
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+k', 'alt alt', 'alt+w']);
    this.unlisten();
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
  toggleNavMenu = (showNavMenu) => {
    this.setState({
      showNavMenu
    });
    this.triggerResize();
  }
  getRouteProps(isActive, pageName) {
    const { userInfo, username, pageProps } = this.props;
    return {
      ...pageProps,
      userInfo,
      username,
      isActive,
      pageName,
      $T: this.$T,
      onNavigate: this.onNavigate,
      history: this.history,
    };
  }
  loadPlugin = (Plugin, props) => {
    let P = IsFunc(Plugin) ? <Plugin /> : Plugin;

    P = React.cloneElement(P, props, {
      onNavigate: this.onNavigate
    });

    return P;
  }
  statusbarConfigFilter = () => {
    const { statusbarConfig, i18nConfig } = this.props;
    return [
      ...statusbarConfig,
      ...(i18nConfig ? [this.getI18nConfig()] : []),
      this.getSystemInfoConfig()
    ];
  }
  getI18nConfig = () => {
    const { i18nConfig } = this.props;
    const { lang } = this.state;
    return {
      component: (
        <DropdownMenu 
          key="i18nConfig"
          needAction={false}
          onChange={val => this.changeLang(val)}
          position="right"
          value={lang}
          values={i18nConfig}>
          {
            () => (
              <div>
                <Icon n="globe" classNames={["mr5"]} />
              </div>
            )
          }
        </DropdownMenu>
      )
    };
  }
  getSystemInfoConfig = () => {
    return {
      icon: "ellipsis-v",
      action: this.renderSystemInfo
    };
  }
  renderSystemInfo = () => {
    const { Footer, versionInfo } = this.props;
    const { theme, darkMode, layout } = this.state;
    ShowModal({
      type: 'side',
      position: 'right',
      title: '系统设置',
      children: (
        <React.Fragment>
          <ShortcutDesc />
          <Theme
            onChangeDarkMode={this.changeDarkMode}
            onChangeTheme={this.changeTheme}
            onChangeLayout={this.changeLayout}
            layout={layout}
            darkMode={darkMode}
            activeTheme={theme} />
          <FooterContainer>
            {
              Footer && this.loadPlugin(Footer, {
                $T: this.$T,
              })
            }
            {
              versionInfo ? (
                <VersionComponent $T={this.$T} versionInfo={versionInfo} />
              ) : null
            }
          </FooterContainer>
        </React.Fragment>
      )
    });
  }
  render() {
    const {
      username,
      logout,
      pageComponents,
      pluginComponent = {},
      menuMappers,
      versionInfo,
      versionUrl,
      // iframeMode,
      // i18nConfig,
      // DashBoard,
      bgStyle,
      tabInStatusbar,
      title
    } = this.props;
    const {
      menuCodeMapper,
      showNavMenu,
      menuData,
      activeMenu,
      displayFloat,
      activeRouteIdx,
      routerInfo,
      // lang,
      ready,
      layout,
      theme,
      routers,
      darkMode,
    } = this.state;
    const {
      Statusbar, NotfoundPage, DashBoard = this.props.DashBoard,
    } = pluginComponent;
    const routersLen = routers.length;
    const hasRouter = routersLen > 0;
    const statusbarConfig = this.statusbarConfigFilter();

    return (
      <div id="managerApp" className={`fill main-container fixbg ${theme} ${layout} ${darkMode ? 'dark' : 'light'}`}>
        <Loading loading={!ready}>
          {
            ready && (
              <React.Fragment>
                <NavMenu
                  onDidMount={this.onGetMenuCodeMapper}
                  menuData={menuData}
                  title={title}
                  logout={logout}
                  // onClickMenu={code => {
                  //   // this.pushRoute(code)
                  // }}
                  // i18nConfig={i18nConfig}
                  // lang={lang}
                  menuMappers={menuMappers}
                  username={username}
                  defaultFlowMode={false}
                  changeLang={this.changeLang}
                  show={showNavMenu}
                  $T={this.$T}
                  onToggleNav={this.toggleNavMenu}
                  activeMenu={activeMenu}/>
                <div
                  className={
                    'pages-container ' + (showNavMenu ? 'show-menu' : 'hide-menu')
                  }>
                  <div className="uke-status-bar" id="statusBar">
                    {tabInStatusbar && (
                      <TabForNavBar
                        changeRoute={this.changeRoute}
                        closeTab={this.closeTab}
                        closeAll={this.closeAll}
                        $T={this.$T}
                        menuCodeMapper={menuCodeMapper}
                        hasRouter={hasRouter}
                        routerInfo={routerInfo}
                        routers={routers}
                        activeRouteIdx={activeRouteIdx}
                        routersLen={routersLen}
                        defaultTitle={e => this.$T('仪表盘')} />
                    )}
                    <span className="flex" />
                    {
                      Statusbar && this.loadPlugin(Statusbar, {
                        onLogout: logout,
                        showShortcut: showShortcut,
                        displayFloat: displayFloat,
                        $T: this.$T,
                        toggleFloat: this.toggleFloat,
                      })
                    }
                    <DefaultStatusbar {...this.props} statusbarConfig={statusbarConfig} />
                  </div>
                  <Tabs 
                    withContent 
                    onlyContent={tabInStatusbar}
                    closeable={hasRouter}
                    closeTip={this.$T('快捷键') + ": alt + w"}
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
                            label={this.$T(menuCodeMapper[route] || route)} 
                            key={key} 
                            onChange={e => this.changeRoute(route, params)}>
                            {
                              C ? (
                                <C {...this.getRouteProps(isActive, route)}/>
                              ) : NotfoundPage ? this.loadPlugin(NotfoundPage) : (
                                <Notfound key={route + '404'}/>
                              )
                            }
                          </Tab>
                        );
                      }) : (
                        <Tab
                          contentClass="dash-board"
                          label={this.$T('仪表盘')}
                          key="dash-board">
                          <DashBoardWrapper
                            CustomerComponent={DashBoard} loadPlugin={this.loadPlugin} {...this.getRouteProps(true)} />
                        </Tab>
                      )
                    }
                  </Tabs>
                </div>
              </React.Fragment>
            )
          }
        </Loading>
        <div className="fill fixbg main-bg-color" style={{
          ...bgStyle,
          zIndex: -1
        }} />
        <VersionChecker versionUrl={versionUrl} versionInfo={versionInfo} />
      </div>
    );
  }
}
