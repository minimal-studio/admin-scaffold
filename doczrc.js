import doczPluginNetlify from "docz-plugin-netlify";
import themeConfig from './docz/theme-config/config';

export default {
  // dest: 'docz-dist',
  title: 'Admin Scaffold',
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
      }],
      raw: `
        <style>
          * {
            box-sizing: border-box;
          }
          #root > div > div:first-of-type > div:first-of-type > div:last-of-type {
            display: none;
          }
          #root > div > div:first-of-type {
            z-index: 101;
          }
          ul ul {
            padding-left: 30px !important;
          }
          #root > div > div:first-of-type > div:first-of-type > div:nth-child(2):before {
            background: transparent;
          }
          #root > div > div:first-of-type > div:first-of-type > div:nth-child(2) h1 {
            font-size: 2.5em;
            font-weight: 100;
          }
          .scrollbar-container {
            max-height: unset!important;
          }
          .CodeMirror {
            font-size: 14px;
            height: 100%!important;
          }
          .CodeMirror pre {
            line-height: 20.8px!important;
          }
          .CodeMirror-line {
            padding: 0 10px!important;
          }
          .CodeMirror-lines {
            padding: 10px 0!important;
          }
          .CodeMirror-linenumber {
            padding: 0 7px 0 5px!important;
          }
          .code-table {
            display: flex;
          }
          .code-table {
            margin-bottom: 1em;
          }
          .code-table > div:first-of-type {
            flex: 1.5;
          }
          .code-table > div:last-of-type {
            flex: 1;
          }
          .code-table > div:last-child {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f4f6f9;
            font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto,
          segoe ui, arial, sans-serif;
            font-size: 4em;
            font-weight: 600;
            color: white;
          }
          .grommetux-meter {
            height: 70px;
          }
          .grommetux-meter__graphic {
            fill: transparent;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 15px;
            width: 70px;
            height: 70px;
          }
          .grommetux-meter__tracks {
            stroke: white;
          }
          .grommetux-meter__values {
            stroke: rgb(45, 55, 71);
          }
          code {
            background: #f4f6f9;
            color: #7D899C;
            margin: 0 3px;
            padding: 4px 6px;
            border-radius: 3px;
            font-family: "Source Code Pro",monospace;
            font-size: 14px;
          }
          a, a:visited, a:active {
            color: rgb(31, 182, 255);
            text-decoration: none;
            cursor: pointer;
          }
        </style>
      `,
    },
  },
  themeConfig: themeConfig,
  menu: [
    'Getting Started / 开始',
    'Scroffold / 脚手架应用',
    'Template-Engin / 模版引擎',
    'HOC-Engin / 高阶模版',
    'ActionAgent / 请求代理',
    'Other',
  ],
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