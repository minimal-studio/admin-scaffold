# uke-admin-web-scaffold

uke 管理后台脚手架引擎，快速打造用户体验一致的管理系统

## 使用方式

### 安装

```shell
npm i uke-admin-web-scaffold --save
```

### 使用

[详情请看 uke admin seed 项目](https://github.com/SANGET/uke-admin-seed.git)

## 提供三个默认数据渲染模版

```js
import { FormRender, ReportTemplate, GeneralReportRender } from 'uke-admin-web-scaffold/template-engine';
```

## 前端资源管理模块

启动时需要通过 setApiUrl 接口设置前端管理服务的地址

```js
import { setApiUrl } from 'uke-admin-web-scaffold/fe-deploy';
setApiUrl('http://127.0.0.6550');
```

## TODO 完善文档说明
