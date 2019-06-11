import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { createBrowserHistory } from "history";
import { getUrlParams, wrapReqHashUrl } from 'uke-request/url-resolve';
import { RemoveArrayItem, CallFunc, IsUrl } from 'basic-helper';

const history = createBrowserHistory();

let ROUTE_KEY = '_R';
const changeRouteKey = (routeKey) => {
  ROUTE_KEY = routeKey;
};

const defaultState = {
  routers: [],
  routerInfo: {},
  activeRouteIdx: -1,
  activeRoute: '',
};

let cachedState = Object.assign({}, defaultState);

const pushToHistory = (url, params) => {
  history.push(url.replace(/\/\//g, '/'), params);
};

const replaceHistory = (url, params) => {
  history.replace(url.replace(/\/\//g, '/'), params);
};

const wrapPushUrl = (pushConfig) => {
  const { href, hash } = window.location;
  const targetHash = hash.replace('#/', '').split('?')[0];
  const { component, route, params } = pushConfig;
  let paramsObj = typeof params == 'string' ? {id: params} : {...params};
  // let paramsStr = '';
  // let otherParams = {...paramsObj};
  // for (const key in otherParams) {
  //   const val = otherParams[key];
  //   paramsStr += `${key}=${val}&&`;
  // }
  let result = wrapReqHashUrl({
    params: {
      [ROUTE_KEY]: route || component,
      ...paramsObj
    },
    toBase64: false
  });
  // let result = `${ROUTE_KEY}=${route || component}/${id}${paramsStr ? ('?' + paramsStr) : ''}`;
  // let result = `/${route}/${id}${paramsStr ? ('?' + paramsStr) : ''}`;
  result = `${targetHash}${result.replace(/&&$/g, '')}`;
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
    //   ShowModal({
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
  constructor(props) {
    super(props);

    const { cacheState } = props;

    if(this.unlisten) this.unlisten();
    this.unlisten = history.listen(this.handleHistory);

    this.state = cacheState ? cachedState : defaultState;
  }
  componentDidMount() {
    this.initRoute();
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
    // const activeRoute = resolvePath(hash)[0];
    const activeRoute = getUrlParams()[ROUTE_KEY];
    const nextRouterState = state.nextRouters;
    this.selectTab(activeRoute, nextRouterState);
  };
  closeAll = () => {
    replaceHistory('/');
    this.setState(prevState => {
      return {
        ...prevState,
        ...defaultState
      };
    });
  }
  closeTab = (idx, routeInfo) => {
    const { routers, routerInfo, activeRouteIdx } = this.state;

    let targetRoute = routers[idx];
    let nextRouters = RemoveArrayItem(routers, targetRoute);
    let nextRouterInfo = {...routerInfo};
    delete nextRouterInfo[targetRoute];
    let nextRoutersLen = nextRouters.length - 1;
    let nextActiveIdx = activeRouteIdx > nextRoutersLen ? nextRoutersLen : activeRouteIdx;
    let nextActiveRoute = nextRouters[nextActiveIdx];

    if(!nextActiveRoute) return this.closeAll();
    
    let nextRouterParams = nextRouterInfo[nextActiveRoute] || {};

    const nextState = {
      routers: nextRouters,
      routerInfo: nextRouterInfo,
      activeRoute: nextActiveRoute,
      activeRouteIdx: nextActiveIdx,
    };

    // pushToHistory(`#/${nextActiveRoute}`, {
    //   type: 'CLOSE',
    //   component: nextActiveRoute,
    //   params: nextRouterInfo,
    //   nextRouters: nextState
    // });
    const config = {
      type: 'PUSH',
      component: nextActiveRoute,
      params: nextRouterParams.params,
      nextRouters: nextState
    };
    // pushToHistory(wrapPushUrl(config), config);
    onNavigate(config);
    
    return nextState;
  }
  selectTab = (activeRoute, nextRouterState) => {
    if(nextRouterState) return this.setState(nextRouterState);
    if(!activeRoute) return;

    this.setState(({ routers, routerInfo }) => {
      const { maxRouters } = this.props;
      let currComIdx = routers.indexOf(activeRoute);
      let nextRouters = [...routers];
      let nextRouterInfo = {...routerInfo};
      nextRouterInfo[activeRoute] = {
        ...(nextRouterInfo[activeRoute] || {}),
        params: getUrlParams()
      };
      let activeIdx = currComIdx;
      if(currComIdx == -1) {
        nextRouters = [...routers, activeRoute];
        /** 做最大路由控制 */
        if(nextRouters.length > maxRouters) {
          const [target, ...other] = nextRouters;
          nextRouters = other;
          delete nextRouterInfo[target];
        }
        activeIdx = nextRouters.length - 1;
      }
      let nextState = {
        activeRoute: activeRoute,
        activeRouteIdx: activeIdx,
        routers: nextRouters,
        routerInfo: nextRouterInfo
      };
      cachedState = nextState;
      return nextState;
    });
  }
  initRoute = () => {
    // let initRoute = resolvePath(location.hash)[0];
    let initRoute = getUrlParams()[ROUTE_KEY];
    initRoute && this.selectTab(initRoute);
  }
}

/**
 * 用于导航到另外页面的组件
 * @param {object} options 参数
 * @TODO: 完善是否激活的判定
 */
const Link = ({ to, className = 'link-btn', children, onClick, params }) => {
  // const { location } = history;
  // const { hash } = location;
  const activeRoute = getUrlParams()[ROUTE_KEY];
  const isActive = activeRoute === to;

  return (
    <span 
      className={className + (isActive ? ' active' : '')}
      onClick={e => {
        CallFunc(onClick)(e);
        if(IsUrl(to)) return window.open(to);
        onNavigate({
          type: 'PUSH',
          route: to,
          params
        });
      }}>
      {children}
    </span>
  );
};
Link.defaultProps = {
  className: 'link-btn',
  params: {}
};
Link.propTypes = {
  /** 将要导航到的路由 */
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  /** 作为 query string 的导航参数，例如 { ID: 123, name: alex } -> ID=123&name=alex */
  params: PropTypes.shape({
    // type: PropTypes.string,
  }),
};

export {
  RouterHelper,
  Link,
  history,
  wrapPushUrl,
  pushToHistory,
  changeRouteKey,
  onNavigate,
};
