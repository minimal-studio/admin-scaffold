import doczPluginNetlify from "docz-plugin-netlify";
import themeConfig from './docz/theme-config/config';

export default {
  // dest: 'docz-dist',
  title: 'Admin-web-scaffold',
  description: 'Uke 管理系统脚手架',
  indexHtml: 'docz/index.html',
  wrapper: 'docz/wrapper',
  codeSandbox: false,
  hashRouter: true,
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        // href: 'https://codemirror.net/theme/dracula.css'
        href: 'https://codemirror.net/theme/mdn-like.css'
      }]
    }
  },
  themeConfig: themeConfig,
  // menu: [
  //   { name: 'Core', menu: ['Avatar', 'Button'] },
  // ],
  modifyBundlerConfig: (config) => {
    config.resolve.extensions.push('.scss');
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    });
    return config;
  },
  plugins: [doczPluginNetlify()]
};