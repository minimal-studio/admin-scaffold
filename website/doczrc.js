// import doczPluginNetlify from "docz-plugin-netlify";
// import { css } from 'docz-plugin-css';
// import path from 'path';
// import themeConfig from './docz/theme-config/config';

export default {
  dest: '../public',
  typescript: true,
  title: 'Dear-UI/Admin-scaffold',
  description: '管理后台系统前端脚手架',
  menu: [
    'Getting Started 开始',
    'Scroffold 脚手架应用',
    'Navigator 导航器',
    'Auth-Selector 验证',
    'Template-Engin 模版引擎',
    'Other',
  ],
  // files: 'temp/**/*.mdx',
  files: 'src/pages/**/*.mdx',
  // notUseSpecifiers: true,
  // filterComponents: files => files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  // indexHtml: 'docz/index.html',
  // wrapper: 'docz/wrapper',
  // public: path.resolve(__dirname, './website/static'),
  // // theme: path.resolve(__dirname, './docz/theme/theme.tsx'),
  // codeSandbox: false,
  // hashRouter: true,
  // htmlContext: {
  //   head: {
  //     links: [{
  //       rel: 'stylesheet',
  //       // href: 'https://codemirror.net/theme/dracula.css'
  //       href: 'https://codemirror.net/theme/mdn-like.css'
  //     }],
  //   },
  // },
  // themeConfig,
  // plugins: [
  //   doczPluginNetlify(),
  //   css({
  //     preprocessor: 'sass',
  //   })
  // ]
};
