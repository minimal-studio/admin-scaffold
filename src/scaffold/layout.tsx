/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';

import Mousetrap from 'mousetrap';
import { ToggleBasicFloatLen, EventEmitter, IsFunc } from '@mini-code/base-func';
import { VersionDisplayer, VersionChecker, VersionCheckerProps } from 'version-helper';

import { Color } from '@deer-ui/core/utils/props';
import { $T } from '@deer-ui/core/utils/config';
import {
  ShowModal, Tabs, Tab, DropdownMenu, ToolTip, Menus,
  Loading, setUILang, Icon, setLangTranslate
} from '../ui-refs';

import { showShortcut, ShortcutDesc } from '../shortcut';
import NavMenu from '../nav-menu';
// import Posts from './posts';
import { RouterHelper, RouterHelperState } from '../router-multiple';
// import VersionComponent, { VersionChecker, VersionCheckerProps } from './plugins/version-com';
import {
  Notfound, DashBoardWrapper, DefaultStatusbar, FooterContainer, TabForNavBar, Theme
} from '../plugins';
import {
  getThemeConfig, setTheme, setLayout, setDarkMode
} from '../plugins/theme';
import { NavMenuProps } from '../nav-menu/nav-menu';
import StatusbarWrapper, { StatusbarProps } from './statusbar';

export interface ScaffoldLayoutProps {
  /** 用户名，用于在左菜单显示 */
  username: string;
  /** 用户登录后的信息，会传递给每一个页面 */
  userInfo?: {};
  /** 版本号文件的路径 */
  versionUrl?: string;
  /** 国际化文件存放目录的路径 */
  i18nMapperUrl?: string;
  /** 退出登录 */
  logout?: () => void;
  /** 插件管理 */
  pluginComponent?: {
    /** 顶部状态栏插件 */
    Statusbar?: any;
    /** DashBoard 插件 */
    DashBoard?: any;
    /** 404 页面插件 */
    NotfoundPage?: any;
    /** Footer 插件 */
    Footer?: any;
  };
  /** 默认主题 */
  defaultTheme?: Color;
  /** 默认布局方式 */
  defaultLayout?: 'vertical' | 'horizontal';
  /** 是否黑夜模式 */
  defaultDarkMode?: boolean;
  /** 默认的语言 */
  defaultLang?: Navigator['language'];
  // iframeMode?: boolean,
  /** 所有的页面的 mapper 引用 */
  pageComponents?: {};
  /** 传给所有页面的 props */
  pageProps?: React.Props<{}>;
  /** 国际化配置 */
  i18nConfig?: {};
  /** 国际化 Mapper */
  i18nMapper?: {};
  /** 最大存在的 tab 路由 */
  maxRouters?: number;
  /** 顶级 tab 是否在 statusbar 中 */
  tabInStatusbar?: boolean;
  /** 是否缓存 state */
  cacheState?: boolean;
  /** 背景 */
  bgStyle?: React.CSSProperties;
  /** 所有菜单的配置 */
  menuStore?: {}[];
  /** 菜单的字段映射 */
  menuMappers?: NavMenuProps['menuMappers'];
  title?: StatusbarProps['title'];
  versionInfo?: VersionCheckerProps['versionInfo'];
  /** DashBoard 插件 */
}

interface ScaffoldLayoutState extends RouterHelperState {
  menuCodeMapper: {};
  activeMenu: string;
  layout: string;
  theme: string;
  menuData: [];
  lang: Navigator['language'];
  showNavMenu: boolean;
  darkMode: boolean;
  displayFloat: boolean;
  ready: boolean;
}

const LANG_MAPPER = {};

export default class ScaffoldLayout extends RouterHelper<ScaffoldLayoutProps, ScaffoldLayoutState> {
  static setI18nUrl = (nextUrl) => {
    // i18nMapperUrl = nextUrl;
    console.warn('该接口已废弃，请通过传入 i18nMapperUrl 的 prop 指定');
  }

  static defaultProps = {
    bgStyle: {},
    maxRouters: 10,
    defaultTheme: 'blue',
    defaultLayout: 'horizontal',
    versionUrl: './js/version.json',
    i18nMapperUrl: './i18n/',
    defaultDarkMode: false,
    statusbarConfig: [],
    tabInStatusbar: true,
    cacheState: true,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      ...this.initThemeConfig(),
      menuCodeMapper: {},
      showNavMenu: true,
      activeMenu: '',
      displayFloat: true,
      menuData: props.menuStore || [],
      lang: props.defaultLang || navigator.language,
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

  geti18nUrl = (lang) => {
    const { i18nMapperUrl } = this.props;
    if (!i18nMapperUrl) return null;
    return `${i18nMapperUrl + lang}.json`;
  }

  initApp = async () => {
    const { i18nMapper } = this.props;
    const { lang } = this.state;
    await this.fetchLangMapper(lang);
    this._setUILang(lang);
    this.setState({
      ready: true
    });
  }

  changeLang = async (lang) => {
    if (!lang) return;
    await this.fetchLangMapper(lang);
    this._setUILang(lang);
    this.setState({
      lang,
    });
  }

  _setUILang = (lang) => {
    setLangTranslate(LANG_MAPPER);
    setUILang(lang);
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
    const url = this.geti18nUrl(lang);
    if (!url) return null;
    try {
      const mapper = await (await fetch(url)).json();
      if (!LANG_MAPPER[lang]) LANG_MAPPER[lang] = {};
      Object.assign(LANG_MAPPER[lang], mapper);
      return mapper;
    } catch (e) {
      console.log(e);
      return {};
    }
    // setState && this.setState({
    //   LANG_MAPPER: mapper
    // });
    // 设置 UI 库的 columns
  }

  triggerResize = () => {
    setTimeout(() => {
      const evt = window.document.createEvent('UIEvents');
      evt.initUIEvent('resize', true, false, window, 0);
      window.dispatchEvent(evt);
    }, 50);
  }

  componentDidMount() {
    Mousetrap.bind(['alt alt'], (e) => {
      this.toggleNavMenu(!this.state.showNavMenu);
      return false;
    });
    Mousetrap.bind(['alt+k'], (e) => showShortcut());
    Mousetrap.bind(['alt+w'], (e) => this.handleCloseFormShortcut());
    this.initRoute();
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+k', 'alt alt', 'alt+w']);
    this.unlisten();
  }

  handleCloseFormShortcut = () => {
    const { activeRouteIdx } = this.state;
    this.closeTab(activeRouteIdx);
  }

  toggleFloat = () => {
    const isDisplay = ToggleBasicFloatLen();
    this.setState(({ displayFloat }) => ({
      displayFloat: !displayFloat
    }));
  }

  onGetMenuCodeMapper = (menuCodeMapper) => {
    this.setState({
      menuCodeMapper
    });
    window.MenuCodeMapper = menuCodeMapper;
  }

  toggleNavMenu = (nextShow) => {
    this.setState(({
      showNavMenu
    }) => {
      const _nextShow = typeof nextShow == 'undefined' ? !showNavMenu : nextShow;
      return {
        showNavMenu: _nextShow
      };
    });
    this.triggerResize();
  }

  getRouteProps(isActive, pageName) {
    const { userInfo, username, pageProps } = this.props;
    return {
      ...pageProps,
      $T,
      userInfo,
      username,
      isActive,
      pageName,
      onNavigate: this.onNavigate,
      history: this.history,
    };
  }

  loadPlugin = (Plugin, props?) => {
    let P = IsFunc(Plugin) ? <Plugin /> : Plugin;

    const defaultProps = {
      onNavigate: this.onNavigate,
      onLogout: this.props.logout,
      showShortcut,
      $T,
      displayFloat: this.state.displayFloat,
      toggleFloat: this.toggleFloat,
    };

    P = React.cloneElement(P, defaultProps, props);

    return P;
  }

  statusbarConfigFilter = () => {
    const { statusbarConfig = [], i18nConfig } = this.props;
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
          onChange={(val) => this.changeLang(val)}
          position="right"
          value={lang}
          values={i18nConfig}
        >
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
            activeTheme={theme}
          />
          <FooterContainer>
            {
              Footer && this.loadPlugin(Footer)
            }
            {
              versionInfo ? (
                <VersionDisplayer $T={$T} versionInfo={versionInfo} />
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
      pageComponents = [],
      pluginComponent = {},
      menuMappers,
      versionInfo,
      versionUrl,
      bgStyle,
      tabInStatusbar,
      title
    } = this.props;
    const {
      menuCodeMapper,
      showNavMenu,
      menuData,
      activeMenu,
      activeRouteIdx,
      routerInfo,
      ready,
      layout,
      theme,
      routers,
      darkMode,
    } = this.state;
    const {
      NotfoundPage, DashBoard = this.props.DashBoard,
    } = pluginComponent;
    const routersLen = routers.length;
    const hasRouter = routersLen > 0;
    const statusbarConfig = this.statusbarConfigFilter();

    return (
      <div id="managerApp" className={`__admin_scaffold_main-container ${theme} ${layout} ${darkMode ? 'dark' : 'light'}`}>
        {
          ready ? (
            <div className="__main-wrapper">
              <StatusbarWrapper
                title={title}
                logout={logout}
                loadPlugin={this.loadPlugin}
                showNavMenu={showNavMenu}
                menuCodeMapper={menuCodeMapper}
                StatusbarPlugin={pluginComponent.Statusbar}
                toggleFloat={this.toggleFloat}
                onToggleNav={this.toggleNavMenu}
                statusbarConfig={statusbarConfig}
              />
              <div className="__content">
                <NavMenu
                  onDidMount={this.onGetMenuCodeMapper}
                  menuData={menuData}
                  menuMappers={menuMappers}
                  defaultFlowMode={false}
                  show={showNavMenu}
                />
                <div
                  className={
                    `pages-container ${showNavMenu ? 'show-menu' : 'hide-menu'}`
                  }
                >
                  <TabForNavBar
                    changeRoute={this.changeRoute}
                    closeTab={this.closeTab}
                    closeAll={this.closeAll}
                    menuCodeMapper={menuCodeMapper}
                    hasRouter={hasRouter}
                    routerInfo={routerInfo}
                    routers={routers}
                    activeRouteIdx={activeRouteIdx}
                    routersLen={routersLen}
                    defaultTitle={(e) => $T('仪表盘')}
                  />
                  <Tabs
                    withContent
                    onlyContent={tabInStatusbar}
                    closeable={hasRouter}
                    closeTip={`${$T('快捷键')}: alt + w`}
                    className="top-tab-wrapper tabs-container"
                    activeTabIdx={hasRouter ? activeRouteIdx : 0}
                    onClose={(idx) => this.closeTab(idx, routerInfo)}
                  >
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
                            label={$T(menuCodeMapper[route] || route)}
                            key={key}
                            onChange={(e) => this.changeRoute(route, params)}
                          >
                            {
                              // eslint-disable-next-line no-nested-ternary
                              C ? (
                                <C {...this.getRouteProps(isActive, route)}/>
                              ) : NotfoundPage ? this.loadPlugin(NotfoundPage) : (
                                <Notfound key={`${route}404`}/>
                              )
                            }
                          </Tab>
                        );
                      }) : (
                        <Tab
                          contentClass="dash-board"
                          label={$T('仪表盘')}
                          key="dash-board"
                        >
                          <DashBoardWrapper
                            CustomerComponent={DashBoard}
                            loadPlugin={this.loadPlugin}
                            {...this.getRouteProps(true, 'dashboard')}
                          />
                        </Tab>
                      )
                    }
                  </Tabs>
                </div>
              </div>
            </div>
          ) : <Loading loading></Loading>
        }
        <div className="fill fixbg main-bg-color" style={{
          ...bgStyle,
          zIndex: -1
        }}
        />
        <VersionChecker versionUrl={versionUrl} versionInfo={versionInfo} />
      </div>
    );
  }
}
