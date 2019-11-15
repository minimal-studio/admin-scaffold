import React from 'react';
import { DateFormat } from '@mini-code/base-func';
import { PureIcon } from '@deer-ui/core/icon';
import { Menus } from '@deer-ui/core/menu';
import { AdminWebScaffold, Link } from '@deer-ui/admin-scaffold';
import ActionAgentPage from '@deer-ui/admin-scaffold/action-agent/demo';
import ReportDemo from '@deer-ui/admin-scaffold/template-engine/for-report/demo';
import { TestFormBasic } from '@deer-ui/admin-scaffold/template-engine/for-form/demo';
import zhCH from '@deer-ui/admin-scaffold/i18n/zh-CN';
import enUS from '@deer-ui/admin-scaffold/i18n/en-US';
import VersionInfo from './version.json';

const githubLink = 'https://github.com/SANGET/minimal-studio/admin-scaffold';
const i18nMapper = {
  'zh-CN': zhCH,
  'en-US': enUS,
};
const Status = () => {
  return (
    <div></div>
  );
};
const Footer = () => {
  const today = new Date();
  return (
    <div className="mr10">
      <span className="mr10">© {DateFormat(today, 'YYYY')}, Made by <a href="https://github.com/SANGET" target="_blank">SANGET</a>, </span>
      <span className="item mr10">
        <PureIcon n="fab fa-github" classNames={['mr5']} />
        <a href={githubLink} target="_blank">
                Github
        </a>
      </span>
      <a href="https://ukelli.com" target="_blank" className="item mr10">
              Blog
      </a>
      <a href="https://ukelli.com" target="_blank" className="item mr10">
              About
      </a>
    </div>
  );
};
const TestPage = (text = 'Test Page') => () => {
  return (
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
};
const pageComponents = {
  ActionAgentPage,
  ReportDemo,
  TestFormBasic,
  TEST1: TestPage('TEST1'),
  TEST2: TestPage('TEST2'),
  TEST3: TestPage('TEST3'),
  TEST4: TestPage('TEST4'),
  'TEST1-1': TestPage('TEST1-1'),
  'TEST2-2': TestPage('TEST2-2'),
  'TEST3-3': TestPage('TEST3-3'),
  'TEST4-4': TestPage('TEST4-4'),
};
const userInfo = {
  username: 'alex'
};
const i18nConfig = {
  'zh-CN': '中文',
  'en-US': 'English',
};
const menuStore = [{
  title: '表格',
  icon: 'table',
  code: 'ReportDemo'
}, {
  title: '表单',
  icon: 'table',
  code: 'TestFormBasic'
},
{
  title: 'UI 库',
  pureIcon: 'fab fa-uikit',
  code: 'https://ui.thinkmore.xyz/',
},
{
  title: '一级菜单',
  child: [
    {
      title: 'ActionAgent',
      code: 'ActionAgentPage',
    },
    {
      title: '测试页面2',
      code: 'TEST2',
    },
    {
      title: '测试页面3',
      code: 'TEST3',
    },
    {
      title: '测试页面4',
      code: 'TEST4',
    },
  ]
}, {
  title: '一级菜单',
  icon: 'book',
  child: [
    {
      title: '测试页面2-1',
      code: 'TEST1-1',
    },
    {
      title: '测试页面2-2',
      code: 'TEST2-2',
    },
    {
      title: '测试页面2-3',
      code: 'TEST3-3',
    },
    {
      title: '测试页面2-4',
      code: 'TEST4-4',
    },
  ]
}];
const statusbarConfig = [
  {
    title: '',
    icon: 'user',
    overlay: () => {
      return <Menus data={[
        {
          text: 'MenuItem1',
        },
        {
          text: 'MenuItem2',
        },
        {
          text: 'MenuItem3',
        },
        'hr',
        {
          text: 'MenuItem4',
        },
      ]} />;
    }
  },
  {
    title: '',
    icon: 'comment',
    overlay: () => {
      return <div className="p20">any...</div>;
    }
  },
  {
    title: '',
    icon: 'tasks',
    overlay: () => {
      return <div className="p20">any...</div>;
    }
  },
  {
    title: '',
    pureIcon: 'fab fa-github',
    action: () => {
      window.open(githubLink);
    }
  },
];

const Example = () => {
  return (
    <div style={{
      height: 600
    }}>
      <AdminWebScaffold
        // DashBoard={DashBoard}
        // 必须填写的
        username={userInfo.username}
        i18nMapperUrl='/public/i18n/'
        versionInfo={VersionInfo}
        i18nMapper={i18nMapper}
        menuMappers={{
          child: 'child',
          code: 'code',
          title: 'title',
          icon: 'icon',
        }}
        title="管理系统"
        menuStore={menuStore}
        i18nConfig={i18nConfig}
        statusbarConfig={statusbarConfig}
        pluginComponent={{
          Statusbar: <Status />,
          Footer
        }}
        pageComponents={pageComponents}/>
    </div>
  );
};

export default Example;
