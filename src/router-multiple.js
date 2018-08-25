import React, { Component } from 'react';

import {getUrlParams} from 'orion-request';
import createBrowserHistory from "history/createBrowserHistory";
import {RemoveArrayItem} from 'basic-helper';

const history = createBrowserHistory();

let cacheState = {
  routers: [],
  routerInfo: {},
  activeRouteIdx: -1,
  activeRoute: '',
};

const pushToHistory = (url, params) => {
  history.push(url.replace(/\/\//g, '/'), params);
}

const wrapPushUrl = (pushConfig) => {
  const {component, params} = pushConfig;
  let paramsObj = typeof params == 'string' ? {id: params} : {...params};
  let paramsStr = '';
  let {id = '', ...other} = paramsObj;
  let otherParams = {...other};
  for (const key in otherParams) {
    const val = otherParams[key];
    paramsStr += `${key}=${val}&&`;
  }
  let result = `/${component}/${id}${paramsStr ? ('?' + paramsStr) : ''}`;
  // let result = `/${component}/${id}${paramsStr ? ('?' + paramsStr) : ''}`;
  result = result.replace(/\&&$/g, '');
  return result;
}

const onNavigate = config => {
  if(!config) return console.log('Not config')
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
}

class RouterHelper extends Component {
  history = history;
  wrapPushUrl = wrapPushUrl;
  pushToHistory = pushToHistory;
  onNavigate = onNavigate;
  changeRoute = (component, params) => {
    onNavigate({
      type: 'PUSH',
      component,
      params
    });
  };
  handleHistory = (location, action) => {
    // console.log(location, action)
    const {hash} = location;
    const activeRoute = resolvePath(hash)[0];
    this.selectTab(activeRoute);
  };
  closeTab = (idx) => {
    this.setState(({routers, routerInfo, activeRouteIdx}) => {
      let targetRoute = routers[idx];
      let nextRouters = RemoveArrayItem(routers, targetRoute);
      let nextRoutersLen = nextRouters.length - 1;
      let activeIdx = activeRouteIdx > nextRoutersLen ? nextRoutersLen : activeRouteIdx;
      let activeRoute = nextRouters[activeIdx];
      return {
        routers: nextRouters,
        activeRoute: activeRoute,
        activeRouteIdx: activeIdx,
        // routerInfo: nextRouterInfo
      }
    })
  }
  selectTab = (activeRoute) => {
    this.setState(({routers, routerInfo}) => {
      let currComIdx = routers.indexOf(activeRoute);
      let nextRouterInfo = {...routerInfo};
      nextRouterInfo[activeRoute] = {
        ...(nextRouterInfo[activeRoute] || {}),
        params: getUrlParams()
      }
      let nextRouters = [...routers];
      let activeIdx = currComIdx;
      if(currComIdx == -1) {
        nextRouters = [...routers, activeRoute];
        activeIdx = nextRouters.length - 1
      }
      let nextState = {
        routers: nextRouters,
        activeRoute: activeRoute,
        activeRouteIdx: activeIdx,
        routerInfo: nextRouterInfo
      }
      cacheState = nextState;
      return nextState;
    });
  }
  state = cacheState;
  constructor(props) {
    super(props);

    history.listen(this.handleHistory);
  }
  initRoute = () => {
    let initRoute = resolvePath(location.hash)[0];
    this.selectTab(initRoute);
  }
  componentDidMount() {
    this.initRoute();
  }
}

const Link = ({ to, className = 'link-btn', children, params }) => {
  const {location} = history;
  const isActive = location.pathname != '/' && _to.indexOf(location.pathname) !== -1;
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
  )
};

export {
  RouterHelper,
  Link,
  history,
  wrapPushUrl,
  pushToHistory,
  onNavigate,
}