/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ShowGlobalModal, Icon, Tabs, Tab, DropdownMenu, ToolTip,
  Loading, setUkelliConfig, setUkeLang
} from 'ukelli-ui';
import Mousetrap from 'mousetrap';
import { ToggleBasicFloatLen, EventEmitter } from 'basic-helper';

import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';
// import Posts from './posts';
import Notfound from './notfound';
import { RouterHelper } from './router-multiple';
import DashBoardWrapper from './dash-board';

let i18nMapperUrl = './i18n/';

export default class ScaffoldLayout extends RouterHelper {
  static setI18nUrl = (nextUrl) => {
    i18nMapperUrl = nextUrl;
  }
  static propTypes = {
    userInfo: PropTypes.object,
    username: PropTypes.string.isRequired,
    onLogout: PropTypes.func,
    pluginComponent: PropTypes.object,
    iframeMode: PropTypes.bool,
    pageComponents: PropTypes.object,
    i18nConfig: PropTypes.object,
    menuStore: PropTypes.arrayOf(PropTypes.object),
    DashBoard: PropTypes.any,
  };

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
    ShowGlobalModal({
      children: <ShortcutHelp/>,
      title: '键盘快捷键说明',
      width: 640
    });
  }
  getRouteProps() {
    const { userInfo, username } = this.props;
    return {
      userInfo,
      username,
      gm: this.gm,
      onNavigate: this.onNavigate,
      history: this.history,
    };
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
      DashBoard,
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
    const { Statusbar, NotfoundPage } = pluginComponent;
    const hasRouter = routers.length > 0;
    // console.log(hasRouter)

    const container = ready ? (
      <div>
        <LeftmenuLayout
          onDidMount={this.onGetMenuCodeMapper}
          menuData={menuData}
          title={title}
          logout={logout}
          onClickMenu={code => {
            // this.pushRoute(code)
          }}
          i18nConfig={i18nConfig}
          menuMappers={menuMappers}
          username={username}
          lang={lang}
          defaultFlowMode={false}
          versionInfo={versionInfo}
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
          <div className="status-bar" id="statusBar">
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
              Statusbar ? React.cloneElement(Statusbar, {
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
            activeTabIdx={hasRouter ? activeRouteIdx : 0}
            onClose={idx => this.closeTab(idx, routerInfo)}>
            {
              hasRouter ? routers.map(route => {
                const C = pageComponents[route];
                const currInfo = routerInfo[route];
                const { params } = currInfo;
                return (
                  <Tab 
                    contentClass={route}
                    label={this.gm(menuCodeMapper[route] || route)} 
                    key={route + JSON.stringify(params)} 
                    onChange={e => this.changeRoute(route, params)}>
                    {
                      C ? (
                        <C {...this.getRouteProps()}/>
                      ) : NotfoundPage ? (
                        <NotfoundPage/>
                      ) : (
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
                  <DashBoardWrapper CustomerComponent={DashBoard}/>
                </Tab>
              )
            }
          </Tabs>
        </div>
      </div>
    ) : null;

    return (
      <div id="managerApp" className="fill">
        <Loading loading={!ready}>
          {container}
        </Loading>
      </div>
    );
  }
}
