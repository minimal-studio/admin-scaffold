import React, { Component } from "react";

import LoginPanel from '@deer-ui/admin-scaffold/auth-selector/login-panel';

const loginFormOptions = [
  {
    ref: "AdminName",
    type: "input",
    title: "Account",
    iconName: "account",
    required: true
  },
  {
    ref: "Password",
    type: "password",
    title: "Password",
    iconName: "lock",
    required: true
  },
  {
    ref: "GooglePassword",
    type: "input",
    iconName: "security",
    title: "Google Auth"
  }
];

export class AuthPage extends Component {
  render() {
    return (
      <LoginPanel
        logo={() => (
          <h3>Manager Login</h3>
        )}
        btnGColor="blue"
        login={(e) => {}}
        formOptions={loginFormOptions}
      />
    );
  }
}
