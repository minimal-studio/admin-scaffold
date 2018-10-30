import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DebounceClass, Call } from 'basic-helper';
import { Icon, Avatar } from 'ukelli-ui';

import { storageHelper } from '../config';

import { Link } from '../router-multiple';
import SearchBox from './search';
import VersionComponent from './version-com';

let delayExec = new DebounceClass();

const MENU_ACTIVE_STORAGE = 'MENU_ACTIVE_STORAGE';

function getScreenHeight() {
  return document.documentElement.clientHeight;
}

function getElementLeft(element) {
  if(!element) return;
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += (current.offsetLeft + current.clientLeft);
    current = current.offsetParent;
  }
  return actualLeft;
}

function getElementTop(element) {
  if(!element) return;
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += (current.offsetTop + current.clientTop);
    current = current.offsetParent;
  }
  return actualTop;
}


const MENU_CODE_MAPPER = 'MENU_CODE_MAPPER';

let menuCodeMapper = storageHelper.get(MENU_CODE_MAPPER, true) || {};

const MenuItem = ({ icon = 'bars', title, gm }) => {
  return (
    <div className="layout a-i-c">
      <Icon n={icon} classNames={['mr10']}/>
      <span>{gm(title)}</span>
      <span className="flex" />
      <Icon n="angle-right" classNames={['direct']}/>
    </div>
  );
};

/**
 * 左菜单控件
 * 支持无限嵌套结构，支持“树”模式，支持“悬浮”模式
 * menuData 结构
 * {
 *   title: '',
 *   code: '',
 *   icon: '',
 *   child: [
 *     // 递归此结构, 避免和 react 的 children 冲突，故为 child
 *     {
 *       title: '',
 *       code: '',
 *       icon: '',
 *       child: []
 *     }
 *   ]
 * }
 */
export default class Leftmenu extends Component {
  static propTypes = {
    onDidMount: PropTypes.func,
    menuMappers: PropTypes.shape({
      child: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
    }),
    /* 是否悬浮模式的菜单模式 */
    flowMode: PropTypes.bool,
    gm: PropTypes.func,
    changeLang: PropTypes.func,
    lang: PropTypes.any,
    menuData: PropTypes.any.isRequired,
    i18nConfig: PropTypes.object,
    onClickMenu: PropTypes.func
  };
  flowModeKey = 'IS_FLOW_MODA';
  constructor(props) {
    super(props);
    let showMenuMapper = window.Storage.getItem(MENU_ACTIVE_STORAGE) || '';
    try {
      showMenuMapper = JSON.parse(showMenuMapper);
    } catch (e) {
      showMenuMapper = {};
    }
    const storageMode = storageHelper.get(this.flowModeKey);
    const { defaultFlowMode = false, menuData } = props;

    window.MENU_DATA = menuData;

    this.state = {
      showMenuMapper,
      flowMenuConfig: {
        activeItem: {},
        activeIdx: '',
        isShow: false,
        offset: {
          top: 0,
          left: 0
        }
      },
      flowMode: storageMode ? (!!+storageMode) : defaultFlowMode
    };
  }
  componentDidMount() {
    Call(this.props.onDidMount, menuCodeMapper);
  }

  changeMenuUIMode(isFlowMode) {
    this.setState({
      flowMode: isFlowMode
    });
    storageHelper.set(this.flowModeKey, isFlowMode ? '1' : '0');
  }

  getNormalMenuChildren = initDataList => {
    if (!initDataList || !Array.isArray(initDataList)) return;
    // if(!initDataList || !Array.isArray(initDataList)) return console.error(initDataList, 'initDataList 参数错误');
    const { onClickMenu, gm } = this.props;
    const { showMenuMapper, flowMode } = this.state;
    let allSet = [];
    let foldIdx = 0;
    const recursive = (dataList) => {
      let currDOMSets = [];
      dataList.forEach((item, currItemIdx) => {
        let _item = this.getMenuItem(item);
        let { child, title, code, icon, path } = _item;
        let key = code + title;
        let to = this.wrapLink(_item);

        let hasChildren = child && child.length > 0;
        let isFold = !code || hasChildren;

        let currFoldIdx = foldIdx;

        ++foldIdx;
        let isActive = showMenuMapper.hasOwnProperty(currFoldIdx);
        let dom = null;
        if (isFold) {
          let childDOM = null;
          if (hasChildren) {
            childDOM = recursive.call(this, child);
          }
          dom = (
            <div
              key={foldIdx}
              className={
                'fold fold-' +
                currFoldIdx +
                (flowMode ? '' : isActive ? ' active' : ' hide-fold')
              }>
              <div
                className="fold-title"
                onClick={e => {
                  !flowMode && this.toggleFold(e, currFoldIdx);
                }}>
                <MenuItem {..._item} gm={gm}/>
                {/* <span className="caret" />
                {gm(title)} */}
              </div>
              <div className="children">{childDOM}</div>
            </div>
          );
        } else {
          dom = this.getMenuLinkerDOM({
            key: key,
            to: to,
            code,
            icon,
            onClick: () => Call(onClickMenu, code),
            menuText: title
          });
        }
        currDOMSets.push(dom);
      });
      return currDOMSets;
    };
    allSet = recursive.call(this, initDataList);
    return allSet;
  };
  toggleFold(e, idx, isShow) {
    e.stopPropagation();
    const { showMenuMapper } = this.state;
    let nextState = Object.assign({}, showMenuMapper);

    if (typeof isShow != 'undefined') {
      isShow ? (nextState[idx] = true) : delete nextState[idx];
    } else {
      if (nextState.hasOwnProperty(idx)) {
        delete nextState[idx];
      } else {
        nextState[idx] = true;
      }
    }

    window.Storage.setItem(MENU_ACTIVE_STORAGE, JSON.stringify(nextState));
    this.setState({
      showMenuMapper: nextState
    });
  }
  setFlowMenu(options) {
    const { flowMenuConfig } = this.state;
    const { targetElem, activeItem, isShow = true, idx } = options;
    let nextOffset = flowMenuConfig.offset;

    if (targetElem) {
      let { offsetWidth, offsetHeight } = targetElem;
      nextOffset = {
        top: getElementTop(targetElem),
        left: getElementLeft(targetElem) + offsetWidth,
        height: offsetHeight
      };
    }
    this.setState({
      flowMenuConfig: {
        offset: nextOffset,
        activeIdx: idx,
        activeItem,
        isShow
      }
    });
  }
  hideFlowMenu = () => {
    delayExec.exec(() => {
      this.setFlowMenu({
        isShow: false
      });
    }, 200);
  }
  getMenuLinkerDOM = ({ code, key, to, onClick, menuText, icon }) => {
    const {gm} = this.props;
    menuCodeMapper[code] = menuText;
    storageHelper.set(MENU_CODE_MAPPER, menuCodeMapper, true);
    return (
      <Link
        key={key}
        className="menu"
        to={to}
        onClick={e => Call(onClick, key)}>
        {
          !icon ? (
            <span className="menu-tip">-</span>
          ) : (
            <Icon n={icon} classNames={['mr10']}/>
          )
        }
        {gm(menuText)}
      </Link>
    );
  };
  wrapLink({path, code}) {
    return path ? code + '?' + path : code;
  }
  getFlowModeDOM = initDataList => {
    const { flowMenuConfig } = this.state;
    const { gm } = this.props;
    const { offset, activeItem = {}, activeIdx } = flowMenuConfig;

    const flowMenuDOM = (
      <div
        className="flow-menu-container"
        onMouseEnter={e => delayExec.cancel()}
        onMouseLeave={e => this.hideFlowMenu()}
        style={{
          left: offset.left
        }}
        ref={flowMenuContainer => {
          if (flowMenuContainer) {
            this.flowMenuContainer = flowMenuContainer;

            let flowContainerHeight = flowMenuContainer.offsetHeight;
            let flowContainerScrollTop = this.leftmenuDOM ? this.leftmenuDOM.scrollTop : 0;
            let expectedOffsetTop = offset.top - flowContainerScrollTop;
            let parentHeight = offset.height;
            let offsetBottom = expectedOffsetTop + flowContainerHeight;

            let overBottom = getScreenHeight() - offsetBottom;
            let finalOffsetTop = expectedOffsetTop;
            let flowMenuOffsetTopPx = parentHeight == flowContainerHeight ? 0 : parentHeight;

            if (overBottom < 0) {
              /**
               * 如果高度超过了底部
               */
              finalOffsetTop = expectedOffsetTop + overBottom;
            }
            flowMenuContainer.style.top = (finalOffsetTop - flowMenuOffsetTopPx) + 'px';
          }
        }}>
        {this.getNormalMenuChildren(activeItem.child)}
      </div>
    );

    const allSet = initDataList.map((item, idx) => {
      let _item = this.getMenuItem(item);
      let { child, title, code, icon } = _item;
      let to = this.wrapLink(_item);
      let isFold = !code || (child && child.length > 0);
      let key = code + title;
      let isHovering = activeIdx == idx;
      return isFold ? (
        <div
          key={idx}
          onMouseEnter={e => {
            delayExec.cancel();
            this.setFlowMenu({
              targetElem: e.target,
              activeItem: _item,
              idx
            });
          }}
          onMouseLeave={e => {
            this.hideFlowMenu();
          }}
          className={'fold' + (isHovering ? ' hover' : '')}>
          <MenuItem {..._item} gm={gm}/>
          {/* <span className="caret" />
          {gm(title)} */}
        </div>
      ) : (
        this.getMenuLinkerDOM({
          key: key,
          to: to,
          icon: icon,
          onClick: () => Call(onClickMenu, code),
          menuText: title
        })
      );
    });

    return (
      <div className="leftmenu-tree">
        {allSet}
        {flowMenuDOM}
      </div>
    );
  };
  getMenuItem = (item) => {
    const { menuMappers } = this.props;
    const { child, code, title, icon } = menuMappers;
    return {
      ...item,
      child: item[child],
      code: item[code],
      title: item[title],
      icon: item[icon],
    };
  }
  showSearch = () => {

  }
  render() {
    const {
      menuData,
      onClickMenu,
      onToggleNav,
      versionInfo,
      title = 'UKE管理系统',
      username,
      gm,
      showLeftMenu
    } = this.props;

    const { flowMode } = this.state;

    const menuTree = flowMode ? (
      this.getFlowModeDOM(menuData)
    ) : (
      <div className="leftmenu-tree">
        {this.getNormalMenuChildren(menuData)}
      </div>
    );

    const renderRes = (
      <div
        ref={leftmenuDOM => {
          if(leftmenuDOM) this.leftmenuDOM = leftmenuDOM;
        }}
        style={showLeftMenu ? {} : {zIndex: -1}}
        className={
          'leftmenu-response' + (flowMode ? ' flow-mode' : ' tree-mode')
        }>
        <div className="menu-header">
          <h5 className="title">
            <span className="mr5">{title}</span>
          </h5>
          <span className="flex" />
          <Icon
            title="菜单搜索"
            onClick={e => {
              this._seatchBox.show();
              // console.log(this._seatchBox.show)
            }}
            n="search"
            classNames={['_action-btn mr10']}/>
          <SearchBox
            ref={e => this._seatchBox = e}
            onClickMenu={onClickMenu}
            onToggleNav={onToggleNav}
            codeMapper={menuCodeMapper}
            showLeftMenu={showLeftMenu}/>
          <Icon 
            title={'切换到' + (!flowMode ? '悬浮' : '传统') + '模式'}
            classNames={['_action-btn']}
            onClick={e => this.changeMenuUIMode(!flowMode)}
            n={!flowMode ? "align-justify" : "align-left"}/>
        </div>
        <div className="userinfo">
          <Avatar size={40} text={username[0]}/>
          <span>
            <div>{username}</div>
            <div>{gm('在线')}</div>
          </span>
        </div>
        {menuTree}
        {
          versionInfo ? (
            <VersionComponent gm={gm} versionInfo={versionInfo} />
          ) : null
        }
      </div>
    );

    return renderRes;
  }
}
