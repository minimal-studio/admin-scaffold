import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createBrowserHistory from "history/createBrowserHistory";
import { getUrlParams } from 'uke-request';
import { RemoveArrayItem } from 'basic-helper';

const history = createBrowserHistory();

let cacheState = {
  routers: [],
  routerInfo: {},
  activeRouteIdx: -1,
  activeRoute: '',
};

const pushToHistory = (url, params) => {
  history.push(url.replace(/\/\//g, '/'), params);
};

const wrapPushUrl = (pushConfig) => {
  const { component, route, params } = pushConfig;
  let paramsObj = typeof params == 'string' ? {id: params} : {...params};
  let paramsStr = '';
  let {id = '', ...other} = paramsObj;
  let otherParams = {...other};
  for (const key in otherParams) {
    const val = otherParams[key];
    paramsStr += `${key}=${val}&&`;
  }
  let result = `/${route || component}/${id}${paramsStr ? ('?' + paramsStr) : ''}`;
  // let result = `/${route}/${id}${paramsStr ? ('?' + paramsStr) : ''}`;
  result = result.replace(/&&$/g, '');
  return result;
};

/**
 * 
 * @param {object} config { type: 'PUSH | GO_BACK | LINK', component: route, params: {} }
 */
const onNavigate = config => {
  if(!config) return console.log('Not config');
  const { location } = history;
  config["from"] = location;
  switch (config.type) {
  case "PUSH":
    var pushUrl = wrapPushUrl(config);
    pushToHistory(`#/${pushUrl}`, config);
    break;
  case "LINK":
    break;
    // case "MODAL":
    //   ShowGlobalModal({
    //     ...config,
    //     showFuncBtn: false
    //   })
    //   break;
  case "GO_BACK":
    history.goBack();
    break;
  }
};

const resolvePath = (path) => {
  let result = path.split('?')[0].replace(/#/g, '');
  let pathArr = result.split('/').filter(item => !!item);
  return pathArr;
};

class RouterHelper extends Component {
  history = history;
  wrapPushUrl = wrapPushUrl;
  pushToHistory = pushToHistory;
  onNavigate = onNavigate;
  state = cacheState;
  constructor(props) {
    super(props);

    history.listen(this.handleHistory);
  }
  changeRoute = (route, params) => {
    onNavigate({
      type: 'PUSH',
      route,
      component: route, // 兼容旧版
      params
    });
  };
  handleHistory = (location, action) => {
    const { hash, state = {} } = location;
    const activeRoute = resolvePath(hash)[0];
    const nextRouterState = state.nextRouters;
    this.selectTab(activeRoute, nextRouterState);
  };
  closeTab = (idx, routeInfo) => {
    const { routers, routerInfo, activeRouteIdx } = this.state;

    let targetRoute = routers[idx];
    let nextRouters = RemoveArrayItem(routers, targetRoute);
    let nextRouterInfo = {...routerInfo};
    delete nextRouterInfo[targetRoute];
    let nextRoutersLen = nextRouters.length - 1;
    let nextActiveIdx = activeRouteIdx > nextRoutersLen ? nextRoutersLen : activeRouteIdx;
    let nextActiveRoute = nextRouters[nextActiveIdx] || '/';

    const nextState = {
      routers: nextRouters,
      routerInfo: nextRouterInfo,
      activeRoute: nextActiveRoute,
      activeRouteIdx: nextActiveIdx,
    };

    pushToHistory(`#/${nextActiveRoute}`, {
      type: 'CLOSE',
      component: nextActiveRoute,
      params: nextRouterInfo,
      nextRouters: nextState
    });
    
    return nextState;
  }
  selectTab = (activeRoute, nextRouterState) => {
    if(nextRouterState) return this.setState(nextRouterState);
    if(!activeRoute) return;

    this.setState(({ routers, routerInfo }) => {
      let currComIdx = routers.indexOf(activeRoute);
      let nextRouterInfo = {...routerInfo};
      nextRouterInfo[activeRoute] = {
        ...(nextRouterInfo[activeRoute] || {}),
        params: getUrlParams()
      };
      let nextRouters = [...routers];
      let activeIdx = currComIdx;
      if(currComIdx == -1) {
        nextRouters = [...routers, activeRoute];
        activeIdx = nextRouters.length - 1;
      }
      let nextState = {
        routers: nextRouters,
        activeRoute: activeRoute,
        activeRouteIdx: activeIdx,
        routerInfo: nextRouterInfo
      };
      cacheState = nextState;
      return nextState;
    });
  }
  initRoute = () => {
    let initRoute = resolvePath(location.hash)[0];
    initRoute && this.selectTab(initRoute);
  }
  componentDidMount() {
    this.initRoute();
  }
}

/**
 * 用于导航到另外页面的组件
 * @param {object} options 参数
 * @TODO: 完善是否激活的判定
 */
const Link = ({ to, className = 'link-btn', children, params }) => {
  const { location } = history;
  const { hash } = location;
  const isActive = hash != '/' && hash.split('/')[1] === to;

  return (
    <span 
      className={className + (isActive ? ' active' : '')}
      onClick={e => onNavigate({
        type: 'PUSH',
        component: to,
        params
      })}>
      {children}
    </span>
  );
};
Link.defaultProps = {
  className: 'link-btn',
  params: {}
};
Link.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  params: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export {
  RouterHelper,
  Link,
  history,
  wrapPushUrl,
  pushToHistory,
  onNavigate,
};