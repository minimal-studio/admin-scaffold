import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormLayout, Button, TipPanel } from 'ukelli-ui';
import { Call } from 'basic-helper/call';

const gradientColorMapper = {
  'red': 'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)',
  'green': 'linear-gradient(120deg, #2af598 0%, #009efd 100%)',
  'blue': 'radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)',
  'wine': 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
  'purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};
const gradientColorFilter = (color) => gradientColorMapper[color] || color;

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
    /** 登陆的 logo */
    logo: PropTypes.func,
    /** didMount 回调 */
    didMount: PropTypes.func,
    /** 按钮的颜色，请参考 UI 库 Button 的配色方案 */
    btnColor: PropTypes.string,
    /** 按钮的渐变颜色 */
    btnGColor: PropTypes.oneOf(
      Object.keys(gradientColorMapper)
    ),
    /** 是否沾满屏幕 */
    fixed: PropTypes.bool,
    /** FormOptions, 参考 ukelli-ui 的 formOptions 配置 */
    formOptions: PropTypes.arrayOf(
      PropTypes.shape({})
    )
  }
  static defaultProps = {
    logging: false,
    autoLoging: false,
    btnColor: 'theme',
    fixed: true,
    logo: () => <h3 className="title">管理系统</h3>
  }
  componentDidMount() {
    Call(this.props.didMount);
  }
  saveForm = e => {
    if(e && e.formHelper) this.formHelper = e.formHelper;
  };
  render() {
    const {
      logging, login, backgroundImage, btnColor,
      autoLoging, formOptions, logo, fixed, btnGColor
    } = this.props;
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
      <div className={"login-panel fixbg " + (fixed ? 'fixed' : '')}
        style={{
          backgroundImage
        }}>
        <div className="login-layout">
          {logo()}
          <FormLayout
            // className="login"
            btnConfig={[
              {
                style: btnGColor ? {
                  backgroundImage: gradientColorFilter(btnGColor)
                } : null,
                type: 'submit',
                text: btnTxt,
                className: 'res login-btn',
                color: btnColor,
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
