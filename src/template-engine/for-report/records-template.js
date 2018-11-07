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

import { getDefPagin } from '../../utils/pagination-helper';
import { getScreenInfo } from '../../utils/dom';

const delayExec = new DebounceClass();

export default class ReportTemplate extends Component {
  static propTypes = {
    onQueryData: PropTypes.func.isRequired,
    gm: PropTypes.func.isRequired,
    showCondition: PropTypes.bool,
    height: PropTypes.number,
    children: PropTypes.any,
    loadingCondition: PropTypes.bool,
    needPaging: PropTypes.bool,
    needCheck: PropTypes.bool,
    whenCheckAction: PropTypes.any,
    autoQuery: PropTypes.bool,
    isMobile: PropTypes.bool,
    // didMountQuery: PropTypes.bool,
    needCount: PropTypes.bool,
  
    keyMapper: PropTypes.array.isRequired,
    conditionOptions: PropTypes.array,

    actionBtns: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.func,
      text: PropTypes.string,
      color: PropTypes.string,
    })),
  
    records: PropTypes.array.isRequired,
    pagingInfo: PropTypes.object,
    querying: PropTypes.bool,
    template: PropTypes.oneOf(['Table', 'CardTable']),
    // hasErr: PropTypes.bool,
    resDesc: PropTypes.string
  };
  static defaultProps = {
    autoQuery: false,
    // didMountQuery: true,
    needCount: false,
    isMobile: false,
    needCheck: false,
    loadingCondition: false,
    showCondition: true,
    needPaging: true,
    template: 'Table',
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
      nextPagin: getDefPagin(),
      conditionData: conditionData || this.conditionHelper.value,
      selectedItems: this.checkedItems
    };
  }

  setTableContainerHeight(fixGroup) {
    delayExec.exec(() => {
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
      needPaging, loadingCondition, height, actionBtns,
      conditionOptions, isMobile, gm, keyMapper,
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
        conditionConfig={conditionOptions || []}
        className={showCondition ? undefined : 'hide'} />
    );
    const actionArea = (
      <div className="action-area">
        <Button
          text={gm("查询")}
          loading={querying}
          onClick={e => this.handleQueryData()}/>
        <Button
          text={gm(displayFloat ? '隐藏小数点' : '显示小数点')}
          className="default ml10"
          onClick={e => this.toggleFloat()}/>
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
        <div className="report-fix-con" ref={e => {
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
