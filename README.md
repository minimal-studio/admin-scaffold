# uke-admin-web-scaffold

基于 React 的管理后台脚手架，深度结合 Ukelli-UI，统一开发方式，统一视觉与交互体验。

- [在线文档](https://scaffold.ukelli.com/)

## 使用方式

### 安装

```shell
# yarn
yarn add uke-admin-web-scaffold
# 或者 npm
npm i uke-admin-web-scaffold --save
```

### 使用

```js
import { AdminWebScaffold } from 'uke-admin-web-scaffold';

class LoginFilter extends React.Component {
  componentDidMount() {
    // this.props.autoLogin();
    Call(window.OnLuanched);
  }
  render() {
    const { isLogin, userInfo } = this.props;
    return (
      <LoginSelector {...this.props}>
        {
          isLogin ? (
            <AdminWebScaffold
              {...this.props}
              // 必须填写的
              username={userInfo.username}
              versionInfo={VersionInfo}
              userInfo={userInfo}
              menuMappers={{
                child: 'child',
                code: 'code',
                title: 'title',
                icon: 'icon',
              }}
              i18nConfig={i18nConfig}
              pluginComponent={{
                Statusbar: <Status />,
                DashBoard: <DashBoard />,
              }}
              pageComponents={pageComponents}/>
          ): null
        }
      </LoginSelector>
    );
  }
}

ReactDOM.render(LoginFilter, document.querySelector('#Main'));
```

## 参考

- [uke admin seed 项目](https://github.com/SANGET/uke-admin-seed.git)
- [uke admin seed 示例](https://admin.ukelli.com/)

## 模版和高阶模版

```js
// 表格模版
import { ReportTemplate } from 'uke-admin-web-scaffold/template-engine';

// 高阶模版函数
import { FormRender, GeneralReportRender } from 'uke-admin-web-scaffold/template-engine';
```

## 请求代理机制 ActionAgent

> 封装了基于 React state 的异步请求管理，制定了异步请求在该页面的生命周期，适用于通用页面

```js
import ActionAgent from 'uke-admin-web-scaffold/action-agent';

// 继承获取 ActionAgent 的 api
class Page extends ActionAgent {
  
}
```

[详情参考](/action-agent)

## 特殊模块说明

- [FormGenerator 表单生成器配置](/G-Desc)
- [FormGenerator 表单生成器](/FormGenerator)