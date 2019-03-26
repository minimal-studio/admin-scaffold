/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Mousetrap from 'mousetrap';
import { ToggleBasicFloatLen, EventEmitter, IsFunc } from 'basic-helper';

import {
  ShowModal, Tabs, Tab, DropdownMenu, ToolTip,
  Loading, setUkelliConfig, setUkeLang, Icon
} from './ui-refs';

import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';
// import Posts from './posts';
import { RouterHelper } from './router-multiple';
import VersionComponent, { VersionChecker } from './version-com';
import Notfound from './notfound';
import DashBoardWrapper from './dash-board';
import DefaultStatusbar from './statusbar';
import FooterContainer from './footer';
import TabForNavBar from './tab-for-nav';
// import MiniNav from './mini-nav';

let i18nMapperUrl = './i18n/';

export default class ScaffoldLayout extends RouterHelper {
  static setI18nUrl = (nextUrl) => {
    i18nMapperUrl = nextUrl;
  }
  static propTypes = {
    /** 用户登录后的信息，会传递给每一个页面 */
    userInfo: PropTypes.shape({}),
    /** 用户名，用于在左菜单显示 */
    username: PropTypes.string.isRequired,
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
    // iframeMode: PropTypes.bool,
    /** 所有的页面的 mapper 引用 */
    pageComponents: PropTypes.shape({}),
    /** 传给所有页面的 props */
    pageProps: PropTypes.shape({}),
    /** 国际化配置 */
    i18nConfig: PropTypes.shape({}),
    /** 最大存在的 tab 路由 */
    maxRouters: PropTypes.number,
    /** 顶级 tab 是否在 statusbar 中 */
    tabInStatusbar: PropTypes.bool,
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
    }),
    /** DashBoard 插件 */
    // DashBoard: PropTypes.any,
  };
  
  static defaultProps = {
    bgStyle: {},
    maxRouters: 10,
    statusbarConfig: [],
    tabInStatusbar: true,
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

    P = React.cloneElement(P, props, {
      onNavigate: this.onNavigate
    });

    return P;
  }
  statusbarConfigFilter = () => {
    const { statusbarConfig, i18nConfig, Footer, versionInfo } = this.props;
    const { lang } = this.state;
    return [
      ...statusbarConfig,
      ...(i18nConfig ? [{
        component: (
          <DropdownMenu 
            key="i18nConfig"
            needAction={false}
            menuWrapper={() => (
              <div>
                <Icon n="globe" classNames={["mr5"]} />
              </div>
            )}
            onChange={val => this.changeLang(val)}
            position="right"
            value={lang}
            values={i18nConfig}/>
        )
      }] : []),
      {
        icon: "ellipsis-v",
        action: () => {
          ShowModal({
            type: 'side',
            position: 'right',
            title: '系统信息',
            children: (
              <FooterContainer>
                {
                  Footer && this.loadPlugin(Footer, {
                    gm: this.gm,
                  })
                }
                {
                  versionInfo ? (
                    <VersionComponent gm={this.gm} versionInfo={versionInfo} />
                  ) : null
                }
              </FooterContainer>
            )
          });
        }
        // component: (
        //   <Icon key="more-options" n="ellipsis-v" classNames={["mr5"]} />
        // )
      }
    ];
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
      tabInStatusbar,
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
    const {
      Statusbar, NotfoundPage, DashBoard = this.props.DashBoard,
    } = pluginComponent;
    const routersLen = routers.length;
    const hasRouter = routersLen > 0;
    const statusbarConfig = this.statusbarConfigFilter();

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
                <div
                  className={
                    'pages-container ' + (showLeftMenu ? 'show-menu' : 'hide-menu')
                  }>
                  <div className="uke-status-bar" id="statusBar">
                    {tabInStatusbar && hasRouter && (
                      <TabForNavBar
                        changeRoute={this.changeRoute}
                        closeTab={this.closeTab}
                        gm={this.gm}
                        menuCodeMapper={menuCodeMapper}
                        routerInfo={routerInfo}
                        routers={routers}
                        activeRouteIdx={activeRouteIdx}
                        routersLen={routersLen} />
                    )}
                    <span className="flex" />
                    {
                      Statusbar && this.loadPlugin(Statusbar, {
                        onLogout: logout,
                        showShortcut: this.showShortcut,
                        displayFloat: displayFloat,
                        gm: this.gm,
                        toggleFloat: this.toggleFloat,
                      })
                    }
                    <DefaultStatusbar {...this.props} statusbarConfig={statusbarConfig} />
                  </div>
                  <Tabs 
                    withContent 
                    onlyContent={tabInStatusbar}
                    closeable={hasRouter}
                    closeTip={this.gm("快捷键") + ": alt + w"}
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
              </div>
            )
          }
        </Loading>
        <div className="fill fixbg main-bg-color" style={{
          ...bgStyle,
          zIndex: -1
        }} />
        <VersionChecker versionInfo={versionInfo} />
      </div>
    );
  }
}
