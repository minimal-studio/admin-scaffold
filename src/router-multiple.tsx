import React, { Component, SFC } from 'react';

import { createBrowserHistory } from "history";
import { getUrlParams, urlParamsToQuery, ParamEntity } from '@mini-code/request/url-resolve';
import { RemoveArrayItem, CallFunc, IsUrl } from '@mini-code/base-func';

export interface RouterHelperState {
  routers: string[];
  routerInfo: {};
  activeRouteIdx: number;
  activeRoute: string;
}

export interface RouterHelperProps {
  maxRouters?: number;
}

const history = createBrowserHistory();

let ROUTE_KEY = '_R';
const changeRouteKey = (routeKey) => {
  ROUTE_KEY = routeKey;
};

const defaultState: RouterHelperState = {
  routers: [],
  routerInfo: {},
  activeRouteIdx: -1,
  activeRoute: '',
};

let cachedState = Object.assign({}, defaultState);

const pushToHistory = (url, params?) => {
  history.push(url.replace(/\/\//g, '/'), params);
};

const replaceHistory = (url, params?) => {
  history.replace(url.replace(/\/\//g, '/'), params);
};

const wrapPushUrl = (pushConfig) => {
  const { href, hash } = window.location;
  const targetHash = hash.replace('#/', '').split('?')[0];
  const { component, route, params } = pushConfig;
  const paramsObj = typeof params == 'string' ? { id: params } : { ...params };
  let result = urlParamsToQuery({
    params: {
      [ROUTE_KEY]: route || component,
      ...paramsObj
    },
    toBase64: false
  });
  result = `${targetHash}${result.replace(/&&$/g, '')}`;
  return result;
};

export interface NavigatorOptions {
  type?: 'LINK' | 'GO_BACK' | 'PUSH';
  route: string;
  params?: ParamEntity;
  from?: any;
}

/**
 * 导航器
 */
const onNavigate = (options: NavigatorOptions) => {
  if (!options) return console.log('Not options');
  const { location } = history;
  options.from = location;
  switch (options.type) {
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
    case "PUSH":
    default:
      var pushUrl = wrapPushUrl(options);
      pushToHistory(`#/${pushUrl}`, options);
      break;
  }
};

const resolvePath = (path) => {
  const result = path.split('?')[0].replace(/#/g, '');
  const pathArr = result.split('/').filter((item) => !!item);
  return pathArr;
};

class RouterHelper<
  P extends RouterHelperProps,
  S extends RouterHelperState = RouterHelperState
> extends Component<P, S> {
  history = history;

  wrapPushUrl = wrapPushUrl;

  pushToHistory = pushToHistory;

  onNavigate = onNavigate;

  unlisten

  constructor(props) {
    super(props);

    const { cacheState } = props;

    if (this.unlisten) this.unlisten();
    this.unlisten = history.listen(this.handleHistory);

    this.state = cacheState ? cachedState : defaultState;
  }

  componentDidMount() {
    this.initRoute();
  }

  changeRoute = (route: string, params) => {
    onNavigate({
      type: 'PUSH',
      route,
      component: route, // 兼容旧版
      params
    });
  };

  handleHistory = (location, action) => {
    const { hash, state = {} } = location;
    const activeRoute = getUrlParams()[ROUTE_KEY];
    const nextRouterState = state.nextRouters;
    this.selectTab(activeRoute, nextRouterState);
  };

  closeAll = () => {
    replaceHistory('/');
    this.setState((prevState) => {
      return {
        ...prevState,
        ...defaultState
      };
    });
  }

  closeTab = (targetIdx: number) => {
    const { routers, routerInfo, activeRouteIdx } = this.state;

    const targetRoute = routers[targetIdx];
    const nextRouters = RemoveArrayItem(routers, targetRoute);
    const nextRouterInfo = { ...routerInfo };
    delete nextRouterInfo[targetRoute];
    const nextRoutersLen = nextRouters.length - 1;
    const nextActiveIdx = activeRouteIdx > nextRoutersLen ? nextRoutersLen : activeRouteIdx;
    const nextActiveRoute = nextRouters[nextActiveIdx];

    if (!nextActiveRoute) return this.closeAll();

    const nextRouterParams = nextRouterInfo[nextActiveRoute] || {};

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

  selectTab = (activeRoute: string, nextRouterState?) => {
    if (nextRouterState) return this.setState(nextRouterState);
    if (!activeRoute) return;

    this.setState(({ routers, routerInfo }) => {
      const { maxRouters } = this.props;
      const currComIdx = routers.indexOf(activeRoute);
      let nextRouters = [...routers];
      const nextRouterInfo = { ...routerInfo };
      nextRouterInfo[activeRoute] = {
        ...(nextRouterInfo[activeRoute] || {}),
        params: getUrlParams()
      };
      let activeIdx = currComIdx;
      if (currComIdx == -1) {
        nextRouters = [...routers, activeRoute];
        /** 做最大路由控制 */
        if (nextRouters.length > maxRouters) {
          const [target, ...other] = nextRouters;
          nextRouters = other;
          delete nextRouterInfo[target];
        }
        activeIdx = nextRouters.length - 1;
      }
      const nextState = {
        activeRoute,
        activeRouteIdx: activeIdx,
        routers: nextRouters,
        routerInfo: nextRouterInfo
      };
      cachedState = nextState;
      return nextState;
    });
  }

  initRoute = () => {
    const initRoute = getUrlParams()[ROUTE_KEY];
    initRoute && this.selectTab(initRoute);
  }
}

export interface LinkProps {
  /** 将要导航到的路由 */
  to: string;
  className?: string;
  title?: string;
  onClick?: (event) => void;
  /** 作为 query string 的导航参数，例如 { ID: 123, name: alex } -> ID=123&name=alex */
  params?: {};
  isActive?: boolean;
}

/**
 * 用于导航到另外页面的组件
 * @param {object} options 参数
 */
const Link: SFC<LinkProps> = (props) => {
  const {
    to, className = 'link-btn', children, onClick, params, isActive, title
  } = props;
  const activeRoute = getUrlParams()[ROUTE_KEY];
  const _isActive = typeof isActive == 'undefined' ? activeRoute === to : isActive;

  return (
    <span
      className={className + (_isActive ? ' active' : '')}
      title={title}
      onClick={(e) => {
        CallFunc(onClick)(e);
        if (IsUrl(to)) {
          window.open(to);
        } else {
          onNavigate({
            type: 'PUSH',
            route: to,
            params
          });
        }
      }}
    >
      {children}
    </span>
  );
};
Link.defaultProps = {
  className: 'link-btn',
  params: {}
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
