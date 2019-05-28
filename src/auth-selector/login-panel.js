import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormLayout, Button, TipPanel } from 'ukelli-ui';
import { Call } from 'basic-helper/call';

export default class LoginPanel extends Component {
  static propTypes = {
    /** 是否登陆中 */
    logging: PropTypes.bool,
    /** 是否自动登陆中 */
    autoLoging: PropTypes.bool,
    /** 登陆的回调 */
    login: PropTypes.func.isRequired,
    /** 登陆框的背景图 */
    backgroundImage: PropTypes.string,
    /** didMount 回调 */
    didMount: PropTypes.func,
    /** FormOptions, 参考 ukelli-ui 的 formOptions 配置 */
    formOptions: PropTypes.arrayOf(
      PropTypes.shape({})
    )
  }
  static defaultProps = {
    logging: false,
    autoLoging: false,
  }
  componentDidMount() {
    Call(this.props.didMount);
  }
  saveForm = e => {
    if(e && e.formHelper) this.formHelper = e.formHelper;
  };
  render() {
    const { logging, login, backgroundImage, autoLoging, formOptions } = this.props;
    const submitable = !autoLoging && !logging;
    let btnTxt;
    switch (true) {
    case autoLoging:
      btnTxt = '自动登陆中...';
      break;
    case logging:
      btnTxt = '登陆中...';
      break;
    default:
      btnTxt = '登陆';
      break;
    }
    return (
      <div className="login-panel fixbg"
        style={{
          backgroundImage
        }}>
        <div className="form-layout">
          <h3 className="title">管理系统</h3>
          <FormLayout
            // className="login"
            btnConfig={[
              {
                type: 'submit',
                text: btnTxt,
                className: 'res',
                action: submitable ? () => {
                  login(this.formHelper.value);
                } : null
              }
            ]}
            // onSubmit={e => {
            //   login(this.formHelper.value);
            // }}
            formOptions={formOptions}
            ref={this.saveForm} />
        </div>
      </div>
    );
  }
}
