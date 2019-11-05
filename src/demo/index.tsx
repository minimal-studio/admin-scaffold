import React from 'react';
import ReactDOM from 'react-dom';

import { AdminWebScaffold, Link } from '@deer-ui/admin-scaffold';
import { AuthSelector } from '@deer-ui/admin-scaffold/auth-selector';

const VersionInfo = {
  version: 'v1.0.0'
};

const TestPage = (text = 'Test Page') => () => (
  <div className="p20">
    {text}
    <Link
      params={{
        ID: 'testID',
        data: '123'
      }}
      className="btn theme" to="TEST2">跳转到 TEST2</Link>
  </div>
);

const pageComponents = {
  TestPage: TestPage('TestPage'),
};

class LoginFilter extends React.Component {
  static defaultProps = {
    userInfo: {
      username: 'Alex'
    }
  }

  state = {
    isLogin: false
  }

  login = () => {
    this.setState({
      isLogin: true
    });
  }

  render() {
    const { isLogin, userInfo } = this.props;
    return (
      <AuthSelector {...this.props}>
        {
          isLogin ? (
            <AdminWebScaffold
              {...this.props}
              login={this.login}
              // 必须填写的
              username={userInfo.username}
              versionInfo={VersionInfo}
              userInfo={userInfo}
              pageComponents={pageComponents}/>
          ) : null
        }
      </AuthSelector>
    );
  }
}

ReactDOM.render(LoginFilter, document.querySelector('#Main'));
