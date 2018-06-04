import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Mousetrap from 'mousetrap';

import Link from './link.js';
import VersionComponent from './version-com';

let delayExec = new $GH.Debounce();

const MENU_ACTIVE_STORAGE = 'MENU_ACTIVE_STORAGE';
const ESC_KEY = 27;

function getScreenHeight() {
  return document.documentElement.clientHeight;
}

let menuCodeMapper = {};
class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchMap: '',
      isShow: false
    };
  }

  componentDidMount() {
    Mousetrap.bind(['alt+s'], e => {
      this._input.focus();
      if (!this.props.showLeftMenu) {
        this.shouldBeHidden = true;
        this.props.onToggleNav(true);
      }
      return false;
    });
  }

  componentWillUnmount() {
    Mousetrap.unbind(['alt+s']);
  }

  searchMenu(val) {
    this.setState({
      searchMap: val
    });
  }
  setSearchCon(isShow) {
    this.setState({
      isShow
    });
  }
  handleEsc = e => {
    if (e.keyCode === ESC_KEY) {
      this._input.blur();
      if (this.shouldBeHidden) {
        this.shouldBeHidden = false;
        this.props.onToggleNav(false);
      }
    }
  };
  render() {
    const { searchMap, isShow } = this.state;
    const { menuCodeMapper, onChangeMenu } = this.props;
    const allCode = Object.keys(menuCodeMapper) || [];
    return (
      <div className={'search-container' + (isShow ? ' show-content' : '')}>
        <input
          ref={c => (this._input = c)}
          type="text"
          placeholder="搜索菜单"
          className="form-control input-sm"
          onChange={e => this.searchMenu(e.target.value)}
          onFocus={e => this.setSearchCon(true)}
          onBlur={e => {
            setTimeout(() => {
              this.setSearchCon(false);
              this.shouldBeHidden = false;
            }, 200);
          }}
          onKeyUp={this.handleEsc}
        />
        <div className="hide-content">
          {
            allCode
              .filter(
                code =>
                  menuCodeMapper[code].indexOf(searchMap) != -1 ||
                  code.indexOf(searchMap.toUpperCase()) != -1
              )
              .map((code, idx) => {
                return (
                  <Link
                    className="result-item"
                    key={idx}
                    to={`${code}`}
                    onClick={e => $GH.CallFunc(onChangeMenu)(code)}>
                    {menuCodeMapper[code]}
                  </Link>
                );
              })
            }
        </div>
      </div>
    );
  }
}

SearchBox.propTypes = {
  onChangeMenu: PropTypes.func
};


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

export default class Leftmenu extends Component {
  constructor(props) {
    super(props);
    let showMenuMapper = window.Storage.getItem(MENU_ACTIVE_STORAGE) || '';
    try {
      showMenuMapper = JSON.parse(showMenuMapper);
    } catch (e) {
      showMenuMapper = {};
    }
    const { flowMode = false } = props;
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
      flowMode
    };
  }
  componentDidMount() {
    $GH.CallFunc(this.props.onDidMount)(menuCodeMapper);
  }

  changeMenuUIMode(isFlowMode) {
    this.setState({
      flowMode: isFlowMode
    });
  }

  getNormalMenuChildren = initDataList => {
    if (!initDataList || !Array.isArray(initDataList)) return;
    // if(!initDataList || !Array.isArray(initDataList)) return console.error(initDataList, 'initDataList 参数错误');
    const { onChangeMenu } = this.props;
    const { showMenuMapper, flowMode } = this.state;
    const self = this;
    let allSet = [];
    let foldIdx = 0;
    function recursive(dataList) {
      let currDOMSets = [];
      dataList.forEach((item, currItemIdx) => {
        let _item = self.getMenuItem(item);
        let { child, title, code } = _item;

        let hasChildren = child && child.length > 0;
        let isFold = !code;

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
            key: code,
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
    const offsetDiff = 300;
    const { flowMenuConfig } = this.state;
    const { targetElem, activeItem, isShow = true, idx } = options;
    let nextOffset = flowMenuConfig.offset;

    if (targetElem) {
      let { offsetWidth, offsetTop, offsetHeight, offsetLeft } = targetElem;
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
  getMenuLinkerDOM = ({ key, onClick, menuText }) => {
    menuCodeMapper[key] = menuText;
    return (
      <Link
        key={key}
        className="menu"
        to={key}
        onClick={e => $GH.CallFunc(onClick)(key)}>
        <span className="menu-tip">-</span>
        {menuText}
      </Link>
    );
  };
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
      let isFold = child && child.length > 0;
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
          key: code,
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
        style={showLeftMenu ? {}:{zIndex: 99}}
        className={
          'leftmenu-response' + (flowMode ? ' flow-mode' : ' tree-mode')
        }>
        <div className="menu-header">
          <h5 className="title">
            <span className="mr5">系统版本</span>
            {
              versionInfo ? (
                <VersionComponent numberVersion={versionInfo.numberVersion} />
              ) : null
            }
          </h5>
          <SearchBox
            onChangeMenu={onChangeMenu}
            onToggleNav={onToggleNav}
            menuCodeMapper={menuCodeMapper}
            showLeftMenu={showLeftMenu}
          />
        </div>
        <div
          className={"menulist-title " + (flowMode ? 'flow' : 'tree')}
          onClick={e => this.changeMenuUIMode(!flowMode)}>
          {flowMode ? '悬浮' : '传统'}导航模式 [点击切换]
        </div>
        {container}
      </div>
    );
  }
}

Leftmenu.propTypes = {
  // onNavigate: PropTypes.func.isRequired,
  // userInfo: PropTypes.object,
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
