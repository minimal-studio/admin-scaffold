/**
 * 组件名    通用报表布局
 * 作者      Alex
 * 日期      2018-07-30
 */

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { GetFloatLen, ToggleBasicFloatLen, HasValue, DebounceClass } from 'basic-helper';
import {
  Pagination, CardTable,
  Loading, Button, Toast,
  Table, ConditionGenerator
} from 'ukelli-ui';

// import { getDefPagin } from '../../utils/pagination-helper';
import { getScreenInfo } from '../../utils/dom';

const delayExec = new DebounceClass();

export default class ReportTemplate extends Component {
  static propTypes = {
    /** 查询数据接口 */
    onQueryData: PropTypes.func.isRequired,
    /** getKeyMapper 获取 i18n */
    gm: PropTypes.func,
    /** 是否显示查询条件 */
    showCondition: PropTypes.bool,
    /** 是否正在获取查询条件 */
    loadingCondition: PropTypes.bool,
    /** 表格的高度 */
    height: PropTypes.any,
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
    // didMountQuery: PropTypes.bool,
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
    resDesc: PropTypes.string
  };
  static defaultProps = {
    autoQuery: false,
    // didMountQuery: true,
    hideFloatable: false,
    needCount: false,
    isMobile: false,
    needCheck: false,
    loadingCondition: false,
    showCondition: true,
    needPaging: true,
    template: 'Table',
    gm: str => str,
    resDesc: '',
  }
  constructor(props) {
    super(props);

    this.state = {
      displayFloat: GetFloatLen() != 0,
      tableHeight: props.height || 200
    };
  }
  // componentDidMount() {
  //   this.setTableContainerHeight();
  // }

  componentWillUnmount() {
    this.restoreBasicFloatLen();
    this.__unmount = true;
  }

  clearCheckeds = () => {
    this._tableRef.clearCheckeds();
  }

  restoreBasicFloatLen() {
    if(GetFloatLen() == 0) {
      ToggleBasicFloatLen();
    }
  }

  toggleFloat() {
    /**
     * 在管理中心的时候可以用，但是关闭管理中心后必须设置回去
     */
    let isDisplay = ToggleBasicFloatLen();
    this.setState({
      displayFloat: isDisplay
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   if((this.props.loading !== nextProps.loading && nextProps.hasErr && !nextProps.loading) || this.props.hasErr !== nextProps.hasErr) {
  //     this.toast.show(nextProps.resDesc, nextProps.hasErr ? 'error' : 'success');
  //   }
  // }

  getQueryData(conditionData) {
    return {
      // nextPagin: getDefPagin(),
      nextPagin: this.props.pagingInfo,
      conditionData: conditionData || this.conditionHelper.value,
      selectedItems: this.checkedItems
    };
  }

  setTableContainerHeight(fixGroup) {
    delayExec.exec(() => {
      if (this.__unmount) return;
      const tableContainerHeight = getScreenInfo().screenHeight - fixGroup.offsetHeight - 200;
      this.setState({
        tableHeight: tableContainerHeight
      });
    }, 100);
  }

  whenMountedQuery = (data) => {
    if(this.didMountQueried) return;
    delayExec.exec(() => {
      this.handleQueryData(data);
    }, 100);
    this.didMountQueried = true;
  }

  handleQueryData(val) {
    this.props.onQueryData(Object.assign({}, this.getQueryData(val), {
      onGetResInfo: this.handleRes
    }));
  }

  handleRes = ({resDesc, hasErr}) => {
    hasErr && this.toast.show(resDesc, hasErr ? 'error' : 'success');
  }

  render() {
    const {
      records = [], pagingInfo = {}, querying = true, children, template,
      needCount, autoQuery, showCondition, needCheck, whenCheckAction,
      needPaging, loadingCondition, height, actionBtns, infoMapper,
      conditionOptions, isMobile, gm, keyMapper, hideFloatable,
      onQueryData
    } = this.props;

    const { displayFloat, tableHeight } = this.state;

    // let _thumbKeyMapper = !isMobile ? keyMapper : keyMapper.filter(item => {
    //   const itemKey = item.key;
    //   return !/Remark|Time|OrderId|Id|Date|Config/.test(itemKey)
    //          && !item.datetime
    //          && !item.date;
    // });

    let templateDOM = null;
    let _tableH = height ? height : tableHeight;

    switch (template) {
    case 'CardTable':
      templateDOM = (
        <Loading loading={querying} inrow>
          <CardTable keyMapper={keyMapper} records={records}/>
        </Loading>
      );
      break;
    case 'Table':
    default:
      templateDOM = (
        <div className="table-container" ref={e => this.renderContent = e}>
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
                records={records}
                needCount={needCount}/>
            </Loading>
          </div>
        </div>
      );
      break;
    }
    if(!templateDOM) return (
      <span>{gm('没有对应的模板')}</span>
    );
    const pagingDOM = needPaging ? (
      <Pagination
        pagingInfo={pagingInfo}
        infoMapper={infoMapper}
        onPagin={nextPagin => {
          onQueryData({
            nextPagin,
            conditionData: this.conditionHelper.value
          });
        }}/>
    ) : null;
    const conditionHelper = loadingCondition ? null : (
      <ConditionGenerator
        ref={conditionHelper => {
          if(conditionHelper) {
            this.conditionHelper = conditionHelper;
            this.whenMountedQuery(conditionHelper.value);
          }
        }}
        onChange={(val, ref) => {
          if(!autoQuery || !HasValue(val[ref])) return;

          delayExec.exec(() => {
            this.handleQueryData(val);
          }, 200);
        }}
        conditionConfig={conditionOptions || []} />
    );
    const actionArea = (
      <div className="action-area">
        <Button
          text={gm("查询")}
          loading={querying}
          onClick={e => this.handleQueryData()}/>
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
        <div className={"report-fix-con " + (showCondition ? undefined : 'hide')} ref={e => {
          this.fixGroup = e;
          if(this.__setHeight) return;
          setTimeout(() => {
            this.setTableContainerHeight(e);
          }, 300);
          this.__setHeight = true;
        }}>
          {conditionHelper}
          {actionArea}
          {children}
        </div>
        <div>
          {pagingDOM}
        </div>
        {templateDOM}
      </div>
    );
  }
}
