// import generateNavConfig from './generate-nav-config';

// const isNetlify = process.env.PLATFORM === "netlify";
// const needDemoMenu = isNetlify || process.env.NODE_ENV === 'development';
const needDemoMenu = true;

const demoMenu = [
  // {
  //   title: '首页',
  //   code: 'HomePage',
  // },
  {
    title: "组件",
    pureIcon: "fab fa-uikit",
    child: [
      {
        title: "UI 组件",
        code: "https://ui.thinkmore.xyz/"
      }
    ]
  }, {
    title: "表格",
    code: "TestReport",
    icon: "chart-bar"
  },
  {
    title: "表格异步查询条件",
    code: "ReportAsync",
    icon: "asterisk"
  },
  {
    title: "表单",
    code: "TestForm",
    icon: "bookmark"
  },
  {
    title: "异步表单数据",
    code: "FormAsync",
    icon: "book"
  },
  {
    title: "表单模版引擎",
    code: "FormWithTMPL",
    icon: "book-open"
  },
  {
    title: "表单模版引擎2",
    code: "FormWithTMPL2",
    icon: "book-reader"
  },
  {
    title: "404",
    code: "Notfound",
    icon: "exclamation-triangle"
  },
  {
    title: "link",
    icon: "link",
    code: "TestLink"
  }
  // {
  //   title: "页面模版",
  //   icon: "anchor",
  //   child: [
  //     {
  //       title: "表格",
  //       code: "TestReport",
  //       icon: "chart-bar"
  //     },
  //     {
  //       title: "表格异步查询条件",
  //       code: "ReportAsync",
  //       icon: "asterisk"
  //     },
  //     {
  //       title: "表单",
  //       code: "TestForm",
  //       icon: "bookmark"
  //     },
  //     {
  //       title: "异步表单数据",
  //       code: "FormAsync",
  //       icon: "book"
  //     },
  //     {
  //       title: "表单模版引擎",
  //       code: "FormWithTMPL",
  //       icon: "book-open"
  //     },
  //     {
  //       title: "表单模版引擎2",
  //       code: "FormWithTMPL2",
  //       icon: "book-reader"
  //     },
  //     {
  //       title: "404",
  //       code: "Notfound",
  //       icon: "exclamation-triangle"
  //     },
  //     {
  //       title: "link",
  //       icon: "link",
  //       code: "TestLink"
  //     }
  //   ]
  // }
];

const NAV_MENU_CONFIG = [
  {
    title: "DashBoard",
    code: "DashBoard",
    icon: "tachometer-alt"
  },
  {
    title: "首页",
    code: "HomePage",
    icon: "home"
  },
  // !isNetlify
  //   ? {
  //       title: "前端资源管理",
  //       icon: "chalkboard",
  //       code: "FEDeploy"
  //     }
  //   : null,
  ...(needDemoMenu ? demoMenu : [])
  // needDemoMenu ? generateNavConfig : null,
];

export default NAV_MENU_CONFIG;
