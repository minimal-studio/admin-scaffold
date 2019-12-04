# @deer-ui/admin-scaffold

Base on React's Admin Manager Scaffold.

## Why

为了兼顾 __快速业务开发__ 和 __统一页面交互、视觉效果__ 两种需求，提供一种采用 __页面声明式描述__ 的开发管理系统前端应用的方案。

- [live demo](https://admin.thinkmore.xyz/)

## 特性

- 专注于业务
- 多页面导航控制（multiple router）
- 导航菜单无限嵌套
- 异步请求状态与对应的页面 UI 状态的关联
- 模版引擎
  - 表格显示
  - 表单控制

## 开始

### 新建目录

```bash
mkdir admin-scaffold-tester && cd "$_"
npm init && git init
```

### 安装依赖

```shell
# yarn
yarn add react react-dom @deer-ui/admin-scaffold @mini-code/base-func @mini-code/request @deer-ui/core react-transition-group

# 使用 @mini-code/scripts 开发环境
yarn add @mini-code/scripts -D

# 或者 npm
npm i react react-dom @deer-ui/admin-scaffold @mini-code/base-func @mini-code/request @deer-ui/core react-transition-group --save

npm i @mini-code/scripts --save-dev
```

### 添加 scripts

打开 `./pacakges.json`，添加项目运行 `scripts`

```json
"scripts": {
  "start": "PORT=8086 minictl start",
  "build": "minictl build"
},
```

### 添加必须文件

#### 1. 添加 /public/index.html

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Uke admin demo</title>
</head>

<body>
  <div id="Main"></div>
</body>
</html>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/airbnb.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.7.1/css/all.min.css">
```

#### 2. 添加 /src/app.tsx

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './main';

ReactDOM.render(
  <App/>,
  document.getElementById('Main')
);
```

#### 3. 添加 /src/main.tsx

```js
import React from 'react';
import { AdminWebScaffold, Link } from '@deer-ui/admin-scaffold';
import './style.scss'

const VersionInfo = {
  numberVersion: 'v1.0.0'
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
  TestPage2: TestPage('TestPage2'),
};

const menuStore = [
  {
    title: '测试页面',
    icon: 'table',
    code: 'TestPage'
  },
  {
    title: '一级菜单',
    child: [
      {
        title: '测试页面2',
        icon: 'table',
        code: 'TestPage2'
      },
      {
        title: '测试页面2',
        icon: 'table',
        code: 'TestPage3'
      },
    ]
  }
]

const userInfo = {
  username: 'Alex'
}

const ScaffoldDemo = () => {
  return (
    <AdminWebScaffold
      menuStore={menuStore}
      username={userInfo.username}
      versionInfo={VersionInfo}
      userInfo={userInfo}
      pageComponents={pageComponents}/>
  );
}

export default ScaffoldDemo;
```

#### 4. 添加 /src/style.scss

```scss
// 引入 scss var
@import '@deer-ui/core/style/var.scss';
@import '@deer-ui/admin-scaffold/style/var.scss';

// 引入其他样式
@import '@deer-ui/core/style/index.scss';
@import '@deer-ui/core/style/color/set-color.scss';
@import '@deer-ui/admin-scaffold/style/index.scss';
@import '@deer-ui/admin-scaffold/style/layout/login.scss';
```

#### 5. 添加 /tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "outDir": "./dist",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": false,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "module": "ES6",
    "moduleResolution": "node",
    "jsx": "react"
  },
  "include": [
    "src"
  ],
  "exclude": [
    "src/**/test/*",
    "dist",
    "build"
  ]
}

```

### 项目结构预览

项目参考 https://github.com/SANGET/admin-scaffold-starter

- public
  - index.html
- src
  - app.tsx
  - main.tsx
  - style.scss
- tsconfig.json

### 运行

```bash
yarn start
```

稍等片刻即可

### 相关项目

- [admin-dashboard](https://github.com/minimal-studio/admin-dashboard.git) 整合了上述内容的管理系统模版框架，开箱即用。
  - Account: admin
  - PW: 123

## 深入了解

### 通用模版和高阶模版

- 表格模版引擎
- 表单模版引擎

```js
// 通用模版
import { ReportTemplate } from '@deer-ui/admin-scaffold/template-engine';

// 高阶模版 HOC
import { FormRender, HOCReportRender } from '@deer-ui/admin-scaffold/template-engine';

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

### 请求代理机制 ActionAgent

> 封装了基于 React state 的异步请求管理，制定了异步请求在该页面的生命周期，适用于通用页面

```js
import ActionAgent from '@deer-ui/admin-scaffold/action-agent';

// 继承获取 ActionAgent 的 api
class Page extends ActionAgent {
  
}
```

[详情参考](/action-agent)

### 特殊模块说明

- [FormGenerator 表单生成器配置](/G-Desc)
- [FormGenerator 表单生成器](/FormGenerator)
