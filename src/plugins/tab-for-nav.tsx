import React, { SFC } from 'react';
import { $T } from '@deer-ui/core/utils';
import { Icon, ToolTip } from '../ui-refs';

export interface TabForNavProps {
  routers;
  routersLen;
  activeRouteIdx;
  closeAll;
  hasRouter;
  routerInfo;
  menuCodeMapper;
  closeTab;
  changeRoute;
  defaultTitle;
}

const TabForNav: SFC<TabForNavProps> = (props) => {
  const {
    routers, routersLen, activeRouteIdx, closeAll, hasRouter,
    routerInfo, menuCodeMapper, closeTab, changeRoute, defaultTitle
  } = props;
  return (
    <div className="tabs-for-multiple-router">
      <div className="tabs-items">
        {
          hasRouter ? (
            <React.Fragment>
              <span className="tab-item close-all-btn ps10">
                <span
                  onClick={(e) => closeAll()}
                >
                  <ToolTip n="window-close" title="关闭所有标签" />
                </span>
              </span>
              {
                routers.map((route, idx) => {
                  const isActive = activeRouteIdx === idx;
                  const currInfo = routerInfo[route];
                  const { params } = currInfo;
                  const text = $T(menuCodeMapper[route] || route);
                  return (
                    <span key={route} className={`tab-item${isActive ? ' active' : ''}`}>
                      <span
                        onClick={(e) => changeRoute(route, params)}
                        className="_btn text"
                      >
                        {/* {
                        isActive && <Icon n="chevron-right" classNames={['mr5', 'indicator']} />
                      } */}
                        {text}
                      </span>
                      <span className="_btn close" onClick={(e) => closeTab(idx, routerInfo)}>x</span>
                    </span>
                  );
                })
              }
            </React.Fragment>
          ) : (
            <span className="tab-item active">
              <span className="text">
                {defaultTitle()}
              </span>
            </span>
          )
        }
      </div>
    </div>
  );
};

export default TabForNav;
