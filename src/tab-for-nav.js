import React from 'react';

export default class TabForNav extends React.PureComponent {
  changeRoute = (route, params) => {
    this.props.changeRoute(route, params);
  }
  render() {
    const {
      routers, routersLen, activeRouteIdx,
      routerInfo, menuCodeMapper, gm, closeTab
    } = this.props;
    return (
      <div className="tabs-in-statusbar">
        <div className="tabs-items">
          {
            routers.map((route, idx) => {
              const isActive = activeRouteIdx === idx;
              const currInfo = routerInfo[route];
              const { params } = currInfo;
              const text = gm(menuCodeMapper[route] || route);
              return (
                <span key={route} className={"tab-item" + (isActive ? ' active' : '')}>
                  <span
                    onClick={e => this.changeRoute(route, params)}
                    className="_btn text">
                    {/* {
                      isActive && <Icon n="chevron-right" classNames={['mr5', 'indicator']} />
                    } */}
                    {text}
                  </span>
                  <span className="_btn close" onClick={e => closeTab(idx, routerInfo)}>x</span>
                </span>
              );
            })
          }
        </div>
      </div>
    );
  }
}

  