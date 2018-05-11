import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { FormHelper, Button } from 'ukelli-ui';

var defaultUserInfo = {
  AdminName: window.DefaultAdmin || '',
  Password: window.DefaultPW || ''
};

export default function LoginPanelGenerator(LoginActions) {
  if(!LoginActions) return console.log('LoginActions is required');
  return class LoginPanel extends LoginActions {
    constructor(props) {
      super(props);
      this.formOptions = [
        {
          ref: 'AdminName',
          type: 'input',
          defaultValue: defaultUserInfo.AdminName,
          title: '账号',
          iconName: 'account',
          required: true
        },
        {
          ref: 'Password',
          type: 'password',
          defaultValue: defaultUserInfo.Password,
          title: '密码',
          iconName: 'lock',
          required: true
        },
        {
          ref: 'GooglePassword',
          type: 'input',
          iconName: 'security',
          title: 'Google认证码'
        }
      ];
    }
    render() {
      const { hasErr, resDesc, loading, onLoginSuccess } = this.props;

      return (
        <form
          className="login-panel"
          onSubmit={e => {
            e.preventDefault();
            if (loading) return;
            this.login({
              data: this.refs.formHelper.value,
              callback: onLoginSuccess
            });
          }}>
          <div className="form-layout">
            <h3 className="title">管理系统</h3>
            <FormHelper formOptions={this.formOptions} ref="formHelper">
              <div className="form-group">
                <button className="btn theme flat login-btn" id="freeLogin">
                  {loading ? '登录中...' : '登录'}
                </button>
              </div>
              <span
                style={{
                  width: '100%',
                  height: '30px',
                  position: 'absolute',
                  margin: '0 auto',
                  left: 0
                }}
                className={
                  'form-tip error text-center p5' + (!hasErr ? ' hide' : '')
                }>
                {resDesc}
              </span>
            </FormHelper>
          </div>
        </form>
      );
    }
  }
}
