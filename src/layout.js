/**
 * 主要布局文件, 不需要单独修改, 以后统一修改
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ShowGlobalModal, Avatar, Tabs, Tab, DropdownMenu, Loading, setUkelliConfig, setUkeLang } from 'ukelli-ui';
import Mousetrap from 'mousetrap';

import ShortcutHelp from './shortcut';
import LeftmenuLayout from './leftmenu';
import Posts from './posts';

import {RouterHelper} from './router-multiple';
let i18nMapperUrl = '/i18n/';

class ManagerLayout extends RouterHelper {
  static setI18nUrl = (nextUrl) => {
    i18nMapperUrl = nextUrl;
  }
  static propTypes = {
    userInfo: PropTypes.object,
    onLogout: PropTypes.func,
    headerPlugin: PropTypes.object,
    iframeMode: PropTypes.bool,
    pageComponents: PropTypes.object,
    i18nConfig: PropTypes.object,
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
    $GH.EventEmitter.subscribe('QUERY_MENU', (resMenuData) => {
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
    let mapper = await (await fetch(url)).text();
    try {
      mapper = JSON.parse(mapper);
    } catch(e) {
      console.log(e)
    }
    // setState && this.setState({
    //   langMapper: mapper
    // });
    // 设置 UI 库的 keyMapper
    setUkelliConfig({
      getKeyMap: this.gm,
    });
    setUkeLang(lang);
    return mapper;
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
    Mousetrap.bind(['ctrl ctrl', 'alt alt'], e => {
      this.toggleLeftMenu(!this.state.showLeftMenu);
      return false;
    });
    Mousetrap.bind(['alt+k'], e => this.showShortcut());
    this.initRoute();
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
  getRouteProps() {
    const {userInfo} = this.props;
    return {
      userInfo,
      gm: this.gm,
      onNavigate: this.onNavigate,
      history: this.history,
    }
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
      i18nConfig,
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

    const container = (
      <div>
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
          gm={this.gm}
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
          <div className="status-bar" id="statusBar">
            {
              HeaderPlugin ? (
                <HeaderPlugin
                  onLogout={logout}
                  showShortcut={this.showShortcut}
                  displayFloat={displayFloat}
                  gm={this.gm}
                  userInfo={userInfo}
                  toggleFloat={this.toggleFloat}/>
              ) : null
            }
            {
              i18nConfig ? (
                <div className="lang-selector">
                  <DropdownMenu 
                    onChange={val => this.changeLang(val)}
                    value={lang}
                    values={i18nConfig}/>
                </div>
              ) : null
            }
          </div>
          <Tabs 
            withContent={true} 
            activeTabIdx={activeRouteIdx} 
            closeabled={true}
            onClose={idx => this.closeTab(idx)}>
            {
              routers.map((route, idx) => {
                let C = pageComponents[route];
                let currInfo = routerInfo[route];
                let {params} = currInfo;
                console.log()
                return C ? (
                  <Tab 
                    label={this.gm(menuCodeMapper[route] || route)} 
                    key={route + JSON.stringify(params)} 
                    onChange={e => this.changeRoute(route, params)}>
                    <C {...this.getRouteProps()}/>
                  </Tab>
                ) : null
              })
            }
          </Tabs>
        </div>
      </div>
    );

    return (
      <div id="managerApp" className="fill">
        <Loading loading={!ready}>
          { ready ? container : null }
        </Loading>
      </div>
    );
  }
}
export default ManagerLayout;