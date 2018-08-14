import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Mousetrap from 'mousetrap';
import {DebounceClass} from 'basic-helper';
import {storageHelper} from '../config';

import Link from './link.js';
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
    menuData: PropTypes.any.isRequired,
    onChangeMenu: PropTypes.func
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
    $GH.CallFunc(this.props.onDidMount)(menuCodeMapper);
  }

  changeMenuUIMode(isFlowMode) {
    this.setState({
      flowMode: isFlowMode
    });
    storageHelper.set(this.flowModeKey, isFlowMode ? '1' : '0')
  }

  getNormalMenuChildren = initDataList => {
    if (!initDataList || !Array.isArray(initDataList)) return;
    // if(!initDataList || !Array.isArray(initDataList)) return console.error(initDataList, 'initDataList 参数错误');
    const { onChangeMenu } = this.props;
    const { showMenuMapper, flowMode } = this.state;
    const self = this;
    let allSet = [];
    let foldIdx = 0;
    const recursive = (dataList) => {
      let currDOMSets = [];
      dataList.forEach((item, currItemIdx) => {
        let _item = self.getMenuItem(item);
        let { child, title, code, path } = _item;
        let key = code + title;
        let to = this.wrapLink(_item);

        let hasChildren = child && child.length > 0;
        let isFold = hasChildren;

        let currFoldIdx = foldIdx;

        ++foldIdx;
        let isActive = showMenuMapper.hasOwnProperty(currFoldIdx);
        let dom = null;
        if (isFold) {
          let childDOM = null;
          if (hasChildren) {
            childDOM = recursive(child);
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
                  !flowMode && self.toggleFold(e, currFoldIdx);
                }}>
                <span className="caret" />
                {title}
              </div>
              <div className="children">{childDOM}</div>
            </div>
          );
        } else {
          dom = self.getMenuLinkerDOM({
            key: key,
            to: to,
            onClick: () => $GH.CallFunc(onChangeMenu)(code),
            menuText: title
          });
        }
        if (window.MENU_MAPPER) window.MENU_MAPPER[Id] = title;
        currDOMSets.push(dom);
      });
      return currDOMSets;
    }
    allSet = recursive(initDataList);
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
  hideFlowMenu() {
    const self = this;
    delayExec.exec(() => {
      self.setFlowMenu({
        isShow: false
      });
    }, 200);
  }
  getMenuLinkerDOM = ({ key, to, onClick, menuText }) => {
    menuCodeMapper[key] = menuText;
    storageHelper.set(MENU_CODE_MAPPER, menuCodeMapper, true)
    return (
      <Link
        key={key}
        className="menu"
        to={to}
        onClick={e => $GH.CallFunc(onClick)(key)}>
        <span className="menu-tip">-</span>
        {menuText}
      </Link>
    );
  };
  wrapLink({path, code}) {
    return path ? code + '?' + path : code;
  }
  getFlowModeDOM = initDataList => {
    const self = this;
    const { flowMenuConfig } = this.state;
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
      let _item = self.getMenuItem(item);
      let { child, title, code } = _item;
      let to = this.wrapLink(_item);
      let isFold = child && child.length > 0;
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
          <span className="caret" />
          {title}
        </div>
      ) : (
        self.getMenuLinkerDOM({
          key: key,
          to: to,
          onClick: () => $GH.CallFunc(onChangeMenu)(code),
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
    }
  }
  render() {
    const {
      menuData,
      onChangeMenu,
      onToggleNav,
      versionInfo,
      title = '系统版本',
      showLeftMenu
    } = this.props;

    const { searchMap, flowMode } = this.state;

    const container = flowMode ? (
      this.getFlowModeDOM(menuData)
    ) : (
      <div className="leftmenu-tree">
        {this.getNormalMenuChildren(menuData)}
      </div>
    );

    return (
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
            {
              versionInfo ? (
                <VersionComponent numberVersion={versionInfo.numberVersion} />
              ) : null
            }
          </h5>
        </div>
        <div className="action-btn-group">
          <span
            className={"menulist-title flex mr10 " + (flowMode ? 'flow' : 'tree')}
            onClick={e => this.changeMenuUIMode(!flowMode)}>
            {flowMode ? '悬浮' : '传统'}导航模式
          </span>
          <span
            className="action-btn"
            onClick={e => onToggleNav(!showLeftMenu)}>
            {showLeftMenu ? '<' : '>'}
          </span>
        </div>
        <SearchBox
          onChangeMenu={onChangeMenu}
          onToggleNav={onToggleNav}
          codeMapper={menuCodeMapper}
          showLeftMenu={showLeftMenu}
        />
        {container}
      </div>
    );
  }
}
