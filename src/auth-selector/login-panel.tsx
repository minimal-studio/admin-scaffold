import React, { Component } from 'react';

import { FormLayout } from '@deer-ui/core';
import { Call } from '@mini-code/base-func/call';
import { Color } from '@deer-ui/core/utils';
import { FormLayoutProps } from '@deer-ui/core/form-layout/form-layout';

const gradientColorMapper = {
  red: 'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)',
  green: 'linear-gradient(120deg, #2af598 0%, #009efd 100%)',
  blue: 'radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)',
  wine: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

export interface LoginPanelProps {
  /** login API */
  login: (loginForm) => void;
  /** FormOptions, 参考 @deer-ui/core 的 formOptions 配置 */
  formOptions: FormLayoutProps['formOptions'];
  /** 是否登陆中 */
  logging?: boolean;
  /** 是否自动登陆中 */
  autoLoging?: boolean;
  /** 登陆框的背景图 */
  backgroundImage?: string;
  /** 登陆的 logo */
  logo?: () => JSX.Element;
  /** didMount 回调 */
  didMount?: () => void;
  /** 按钮的颜色，请参考 UI 库 Button 的配色方案 */
  btnColor?: Color;
  /** 按钮的渐变颜色 */
  btnGColor?: 'red' | 'green' | 'blue' | 'wine' | 'purple';
  /** 是否沾满屏幕 */
  fixed?: boolean;
}
const gradientColorFilter = (color) => gradientColorMapper[color] || color;

export default class LoginPanel extends Component<LoginPanelProps> {
  static defaultProps = {
    logging: false,
    autoLoging: false,
    btnColor: 'theme',
    fixed: true,
    logo: () => <h3 className="title">管理系统</h3>
  }

  formHelper

  componentDidMount() {
    Call(this.props.didMount);
  }

  saveForm = (e) => {
    if (e && e.formHelper) this.formHelper = e.formHelper;
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
      <div className={`login-panel fixbg ${fixed ? 'fixed' : ''}`}
        style={{
          backgroundImage
        }}
      >
        <div className="login-layout">
          {logo && logo()}
          <FormLayout
            // className="login"
            formBtns={[
              {
                style: btnGColor ? {
                  backgroundImage: gradientColorFilter(btnGColor)
                } : null,
                type: 'submit',
                text: btnTxt,
                className: 'res login-btn lg',
                color: btnColor,
                action: submitable ? () => {
                  login(this.formHelper.value);
                } : undefined
              }
            ]}
            // onSubmit={e => {
            //   login(this.formHelper.value);
            // }}
            isMobile
            formOptions={formOptions}
            ref={this.saveForm}
          />
        </div>
      </div>
    );
  }
}
