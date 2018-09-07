/**
 * 表格渲染模版
 */

 import React, {Component, PureComponent} from 'react';

 import ReportLayoutRender from './records-template';

 export function GeneralReportRender(Action, passProps = {}) {
   return class C extends Action {
     getActionBtn(item) {
       const {actionBtnConfig} = this;
       if(!actionBtnConfig) return '-';
       return actionBtnConfig.map((config, idx) => {
         const {text, action} = config;
         return (
          <span className="link-btn mr5" key={idx} onClick={e => {
            action(item);
          }}>{text}</span>
        )
       })
     }
     render() {
       return (
         <ReportLayoutRender
           keyMapper={this.keyMapper}
           conditionOptions={this.conditionOptions}
           needCount={this.needCount}

           {...passProps}
           {...this.state}
           {...this.props}
           onQueryData={this.queryData.bind(this)}/>
       )
     }
   }
 }
