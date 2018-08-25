import React, { Component } from 'react';
import withRouter from 'react-router/withRouter';
import CacheRoute, {getPageCache, delPageCacheItem, getCurrPathname} from './cache-router';

const SAVE_TABS = 'save_tabs';

const selector = (name) => {
  return document.querySelector(name) || {};
}

class TabContent extends Component {
  state = {
    pageCententHeight: 200
  }
  constructor(props) {
    super(props);

    window.GetOutSideHeight = this.getOutSideHeight;
  }
  getOutSideHeight = () => {
    let statusBarHeight = selector('#statusBar').offsetHeight || 0;
    let pageRouterHeight = selector('#pageRouter').offsetHeight;

    return statusBarHeight + pageRouterHeight + 20;
  }
  setMainPageContentHeight() {
    let resultHeight = this.genPageContentHeight(this.getOutSideHeight());
    
    this.setState({
      pageCententHeight: resultHeight
    });

    window.GenPageCententHeight = (targetHeight) => {
      return this.genPageContentHeight(minuHeight + targetHeight);
    };
  }
  genPageContentHeight(targetHeight) {
    return `calc(100vh - ${targetHeight}px)`
  }
  componentDidMount() {
    this.setMainPageContentHeight();
    const { history } = this.props;
    let currPathname = getCurrPathname();
    // 绑定快捷键关闭标签页
    Mousetrap.bind(['alt+w'], e => {
      let routes = this.routes;
      let currPathname = getCurrPathname();
      routes = routes.filter(item => item != currPathname);
      delPageCacheItem(currPathname);
      history.replace(routes[routes.length - 1] || '/');
      return false;
    });

    // 重新挂载当前tab页
    Mousetrap.bind(['alt+r'], e => {
      let routes = this.routes;
      let currPathname = getCurrPathname();
      routes = routes.filter(item => item != currPathname);
      delPageCacheItem(currPathname);
      history.replace(routes[routes.length - 1] || '/');
      history.replace(currPathname);
      return false;
    });

    // 保存当前打开的标签页
    Mousetrap.bind(['alt+a'], e => {
      if (this.routes.length < 1) return;
      const json = {
        routes: this.routes,
        pathname: currPathname
      };
      localStorage.setItem(SAVE_TABS, JSON.stringify(json));
      return false;
    });

    // 快捷打开保存的标签页
    Mousetrap.bind(['alt+o'], e => {
      const data = localStorage.getItem(SAVE_TABS);
      if (!data) return;
      const { routes, pathname } = JSON.parse(data);
      routes.forEach(path => {
        history.replace(path);
      });
      history.replace(pathname);
      return false;
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+w', 'alt+r', 'alt+o', 'alt+a']);
  }

  render() {
    const { history, iframeMode, multiple, menuCodeMapper, location } = this.props;
    const { pageCententHeight } = this.state;

    let tabs = [];
    let tab_contents = [];
    let routes = [];
    let CACHE_PAGES = getPageCache();
    let activePathname = getCurrPathname();

    for (let currPath in CACHE_PAGES) {
      let currRoute = CACHE_PAGES[currPath];
      routes.push(currRoute);
      let componentName = currPath.replace('/', '');
      let contentKey = componentName;
      console.log(currRoute)
      // console.log(componentName + location.search, typeof contentKey)
      tabs.push(
        <span
          key={currPath}
          className={'tab' + (activePathname == currPath ? ' active' : '')}>
          <span
            className="text"
            onClick={e => {
              history.replace(currPath);
            }}>
            {menuCodeMapper[componentName] || componentName}
          </span>
          <span
            className="close-btn"
            onClick={e => {
              routes = routes.filter(item => item != currPath);
              delPageCacheItem(currPath);
              history.replace(
                activePathname != currPath ? activePathname : routes[routes.length - 1] || '/'
              );
            }}>x</span>
        </span>
      );
      tab_contents.push(
        <div key={contentKey}
          className={'content ' + (activePathname == currPath ? ' ' : 'hide ') + componentName}>
          <currRoute.component {...this.props}/>
        </div>
      );
    }
    this.routes = routes;

    return (
      <React.Fragment>
        <div className="page-router" id="pageRouter">{tabs}</div>
        <div className="page-content" 
          style={{
            height: pageCententHeight
          }}
          id="pageCententContainer">{tab_contents}</div>
      </React.Fragment>
    );
  }
}

const TabContentWithRouter = withRouter(TabContent);

export default TabContentWithRouter;