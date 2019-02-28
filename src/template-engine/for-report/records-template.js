/**
 * 组件名    通用报表布局
 * 作者      Alex
 * 日期      2018-07-30
 */

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { GetFloatLen, ToggleBasicFloatLen, HasValue, DebounceClass, Call } from 'basic-helper';
import {
  Pagination, CardTable,
  Loading, Button, Toast,
  Table, ConditionGenerator,
  getElementOffset,
} from '../../ui-refs';

// import { getDefPagin } from '../../utils/pagination-helper';
import { getScreenInfo } from '../../utils/dom';

const delayExec = new DebounceClass();

const offsetBottom = 70;

export default class ReportTemplate extends Component {
  static propTypes = {
    /** 查询数据接口 */
    onQueryData: PropTypes.func.isRequired,
    /** 当查询条件改变时 */
    onChangeCondition: PropTypes.func,
    /** getKeyMapper 获取 i18n */
    gm: PropTypes.func,
    /** 是否显示查询条件 */
    showCondition: PropTypes.bool,
    /** 是否正在获取查询条件 */
    loadingCondition: PropTypes.bool,
    /** 表格的高度 */
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /** 是否自动计算并填充表格的高度 */
    calculateHeight: PropTypes.bool,
    /** children */
    children: PropTypes.any,
    /** 是否需要分页 */
    needPaging: PropTypes.bool,
    /** 是否需要隐藏小数点按钮 */
    hideFloatable: PropTypes.bool,
    /** 是否需要表格的选择器 */
    needCheck: PropTypes.bool,
    /** 当有表格的细项被选中后出现的 DOM */
    whenCheckAction: PropTypes.any,
    /** 是否改变查询条件后自动执行查询 */
    autoQuery: PropTypes.bool,
    /** 是否移动端 */
    isMobile: PropTypes.bool,
    /** 是否需要页面加载完后自动触发一次查询条件 */
    didMountQuery: PropTypes.bool,
    /** 是否需要表格统计 */
    needCount: PropTypes.bool,
    
    /** Ukelli UI 的表格渲染组件需要的配置 */
    keyMapper: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
    })).isRequired,
    /** Ukelli UI 查询生成器需要的配置 */
    conditionOptions: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
    })),

    /** 在查询条件的按钮们 */
    actionBtns: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.func,
      text: PropTypes.string,
      color: PropTypes.string,
    })),

    /** 由于不确定远端分页数据具体字段，所以有分页数据的字段映射 */
    infoMapper: PropTypes.shape({}),
  
    /** 表格渲染记录数据 */
    records: PropTypes.array.isRequired,
    /** 分页数据 */
    pagingInfo: PropTypes.object,
    /** 数据是否查询中 */
    querying: PropTypes.bool,
    /** 数据渲染组件 */
    template: PropTypes.oneOf(['Table', 'CardTable']),
    // hasErr: PropTypes.bool,
    /** 数据查询的返回描述 */
    resDesc: PropTypes.string,
    
    /** 忽略的排序字段 */
    sortIgnores: PropTypes.array,
  };
  static defaultProps = {
    autoQuery: false,
    didMountQuery: true,
    hideFloatable: true,
    needCount: false,
    calculateHeight: true,
    querying: true,
    isMobile: false,
    needCheck: false,
    loadingCondition: false,
    showCondition: true,
    needPaging: true,
    template: 'Table',
    conditionOptions: [],
    gm: str => str,
    resDesc: '',
  }
  defaultPagin = {};
  templateDOM = null;
  constructor(props) {
    super(props);

    this.state = {
      displayFloat: GetFloatLen() != 0,
      tableHeight: props.height || 200
    };
  }

  componentDidMount() {
    this.defaultPagin = this.props.pagingInfo;
  }

  componentDidUpdate() {
    // console.log('asd')
    this.setTableContainerHeight();
  }

  componentWillUnmount() {
    this.restoreBasicFloatLen();
    this.__unmount = true;
    this.didMountQueried = false;
  }

  clearCheckeds = () => {
    this._tableRef.clearCheckeds();
  }

  handleRes = ({resDesc, hasErr}) => {
    hasErr && this.toast.show(resDesc, hasErr ? 'error' : 'success');
  }

  whenMountedQuery = (data) => {
    if(this.didMountQueried) return;
    delayExec.exec(() => {
      this.handleQueryData(data);
      this.didMountQueried = true;
    }, 100);
  }

  refreshData = () => {
    this.props.onQueryData(this.getQueryData());
  }

  /**
   * 获取查询条件
   * @param {object} conditionData 查询条件
   * @param {object} nextPagin 下一个分页数据
   * @param {boolean} [merge=true] 是否把 conditionData 合并到 this.conditionHelper.value 之中
   * @memberof ReportTemplate
   */
  getQueryData = (conditionData, nextPagin, merge = true) => {
    const _conditionData = merge ? Object.assign({}, this.conditionHelper.value, conditionData) : conditionData || this.conditionHelper.value;
    return {
      nextPagin: nextPagin || this.props.pagingInfo,
      conditionData: _conditionData,
      selectedItems: this.checkedItems
    };
  }

  setTableContainerHeight = () => {
    const tableContainer = this.tableContainerRef;
    if(this.__setHeight || !tableContainer) return;
    delayExec.exec(() => {
      if (this.__unmount) return;
      const tableContainerOffsetTop = getElementOffset(tableContainer).offsetTop;
      /** 高度调整策略，如果该页面被隐藏，则在下一次 update 的时候更新此高度，保证高度的正确性 */
      if(tableContainerOffsetTop === 0) {
        this.__setHeight = false;
        return;
      }
      
      const tableContainerHeight = getScreenInfo().screenHeight - tableContainerOffsetTop - offsetBottom;
      this.setState({
        tableHeight: tableContainerHeight
      });
      this.__setHeight = true;
    }, 100);
  }

  restoreBasicFloatLen = () => {
    if(GetFloatLen() == 0) {
      ToggleBasicFloatLen();
    }
  }

  toggleFloat = () => {
    /**
     * 在管理中心的时候可以用，但是关闭管理中心后必须设置回去
     */
    let isDisplay = ToggleBasicFloatLen();
    this.setState({
      displayFloat: isDisplay
    });
  }

  handleQueryData = (val) => {
    /** TODO: 观察，点击查询的时候，默认返回第一页 */
    const data = Object.assign({}, this.getQueryData(val, this.defaultPagin), {
      onGetResInfo: this.handleRes
    });
    this.props.onQueryData(data);
  }

  handleChangeCondition = (val, ref) => {
    const { autoQuery, onChangeCondition } = this.props;

    delayExec.exec(() => {
      Call(onChangeCondition, val, ref);
    }, 200);

    if(!autoQuery || !HasValue(val[ref])) return;

    delayExec.exec(() => {
      this.handleQueryData(val);
      Call(onChangeCondition, val, ref);
    }, 200);
  }

  saveConditionRef = e => {
    if(e) {
      this.conditionHelper = e;
      if(this.props.didMountQuery) this.whenMountedQuery(e.value);
    }
  }

  handlePagin = nextPagin => {
    this.props.onQueryData({
      nextPagin,
      conditionData: this.conditionHelper.value
    });
  }

  render() {
    const {
      records = [], pagingInfo = {}, querying, children, template,
      needCount, showCondition, needCheck, whenCheckAction,
      needPaging, loadingCondition, height, actionBtns, infoMapper,
      conditionOptions, gm, keyMapper, hideFloatable, calculateHeight,
      onQueryData, sortIgnores, needSort
    } = this.props;

    const { displayFloat, tableHeight } = this.state;

    // let _thumbKeyMapper = !isMobile ? keyMapper : keyMapper.filter(item => {
    //   const itemKey = item.key;
    //   return !/Remark|Time|OrderId|Id|Date|Config/.test(itemKey)
    //          && !item.datetime
    //          && !item.date;
    // });

    let _tableH = height ? height : tableHeight;

    switch (template) {
    case 'CardTable':
      this.templateDOM = (
        <Loading loading={querying} inrow>
          <CardTable keyMapper={keyMapper} records={records}/>
        </Loading>
      );
      break;
    case 'Table':
    default:
      this.templateDOM = (
        <div className="table-container" ref={e => {
          if(!calculateHeight || height || !e || records.length === 0) return;
          this.tableContainerRef = e;
          this.setTableContainerHeight();
        }}>
          <div className="table-scroll">
            <Loading loading={querying} inrow>
              <Table
                height={_tableH}
                ref={e => this._tableRef = e}
                keyMapper={keyMapper}
                needCheck={needCheck}
                whenCheckAction={whenCheckAction}
                onCheck={nextItems => {
                  this.checkedItems = nextItems;
                }}
                sortIgnores={sortIgnores}
                needSort={needSort}
                records={records}
                needCount={needCount}/>
            </Loading>
          </div>
        </div>
      );
      break;
    }
    if(!this.templateDOM) return (
      <span>{gm('没有对应的模板')}</span>
    );
    const pagingDOM = needPaging ? (
      <Pagination
        pagingInfo={pagingInfo}
        infoMapper={infoMapper}
        onPagin={this.handlePagin}/>
    ) : null;
    const conditionHelper = !loadingCondition && (
      <ConditionGenerator
        ref={this.saveConditionRef}
        onChange={this.handleChangeCondition}
        conditionConfig={conditionOptions} />
    );
    const actionArea = (
      <div className="action-area">
        <Button
          text={gm("查询")}
          className="mr10"
          loading={querying}
          onClick={e => this.handleQueryData()}/>
        <Button
          text={gm("清空")}
          color="red"
          onClick={e => {
            if(!this.conditionHelper.clearValue) return console.log('请升级 UI 库到 2.14.34 以上');
            this.conditionHelper.clearValue();
          }}/>
        {
          !hideFloatable && (
            <Button
              text={gm(displayFloat ? '隐藏小数点' : '显示小数点')}
              className="default ml10"
              onClick={e => this.toggleFloat()}/>
          )
        }
        {
          actionBtns && actionBtns.map(btn => {
            const { text, action, color = 'default' } = btn;
            return (
              <Button
                key={text}
                text={text}
                className={"ml10 " + color}
                onClick={action}/>
            );
          })
        }
      </div>
    );

    return (
      <div className="report-table-layout">
        <Toast ref={toast => this.toast = toast}/>
        <div className={"report-fix-con" + (showCondition ? '' : ' hide')}>
          {conditionHelper}
          {actionArea}
          {children}
        </div>
        <div>
          {pagingDOM}
        </div>
        {this.templateDOM}
      </div>
    );
  }
}
