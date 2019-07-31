import doczPluginNetlify from "docz-plugin-netlify";
import { css } from 'docz-plugin-css';
import themeConfig from './docz/theme-config/config';

export default {
  // dest: 'docz-dist',
  title: 'Admin Scaffold',
  description: 'Uke 管理系统脚手架',
  indexHtml: 'docz/index.html',
  wrapper: 'docz/wrapper',
  filterComponents: files => files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  typescript: true,
  codeSandbox: false,
  hashRouter: true,
  files: '**/*.mdx',
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        // href: 'https://codemirror.net/theme/dracula.css'
        href: 'https://codemirror.net/theme/mdn-like.css'
      }],
    },
  },
  themeConfig,
  menu: [
    'Getting Started 开始',
    'Scroffold 脚手架应用',
    'Navigator 导航器',
    'Auth-Selector 验证',
    'Template-Engin 模版引擎',
    'Other',
  ],
  plugins: [
    doczPluginNetlify(),
    css({
      preprocessor: 'sass',
    })
  ]
};
