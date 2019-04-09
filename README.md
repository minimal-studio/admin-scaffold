# uke-admin-web-scaffold

- [在线文档](https://scaffold.ukelli.com/)

uke-admin-web-scaffold 是基于 React 的管理后台前端脚手架，提供完善的功能，包括

- 多标签页共存
- 前端路由导航
- 可无限嵌套的导航菜单
- 各种可自定义的插件接口
  - 状态栏 Statusabar
  - 脚注 Footer
- 模版引擎
  - 表格引擎 ReportTemplateEngin
  - 表单引擎 FormTemplateEngin
- 异步请求状态与 React state 的数据绑定封装 (ActionAgent)
- 前端资源发布模块

## Usage

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

- [uke-dashboard Github](https://github.com/SANGET/uke-admin-seed.git)
- [uke-dashboard 在线事例](https://admin.ukelli.com/)

## 通用模版和高阶模版

```js
// 通用模版
import { ReportTemplate } from 'uke-admin-web-scaffold/template-engine';

// 高阶模版 HOC
import { FormRender, HOCReportRender } from 'uke-admin-web-scaffold/template-engine';

// 通用模版
const GenernalTMPL = () => {
  const templateOptions = {};
  return (
    <ReportTemplate {...templateOptions} />
  )
}

// 高阶模版 HOC
const HOC_TMPL_REPORT = () => {
  return (
    <HOCReportRender />
  )
}
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