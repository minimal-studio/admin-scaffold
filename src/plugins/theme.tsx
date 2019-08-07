import React, { useState } from 'react';
import Storage from 'basic-helper/storage';

import { NatureColors } from 'ukelli-ui/core/utils';
import { Switch } from '../ui-refs';

const _themes = NatureColors;
const _layout = ['vertical', 'horizontal'];

const themeDefined = '_THEME_';
const layoutDefined = '_LAYOUT_';
const darkModeDefined = '_DARK_MODE_';

const getThemeConfig = () => {
  const theme = Storage.getItem(themeDefined);
  const layout = Storage.getItem(layoutDefined);
  const darkMode = Storage.getItem(darkModeDefined);

  return {
    theme, layout, darkMode: darkMode == 'true'
  };
};

const setTheme = (theme) => {
  Storage.setItem(themeDefined, theme);
};

const setLayout = (layout) => {
  Storage.setItem(layoutDefined, layout);
};

const setDarkMode = (darkMode) => {
  Storage.setItem(darkModeDefined, darkMode);
};

const Theme = ({
  activeTheme, darkMode, layout,
  onChangeDarkMode, onChangeTheme, onChangeLayout
}) => {
  const [_activeTheme, _setTheme] = useState(activeTheme);
  return (
    <div className="theme-changer">
      <div>
        <h5>主题选择</h5>
        {
          _themes.map((color) => {
            const isActive = _activeTheme === color;
            return (
              <span
                className={`item ${isActive ? 'active' : ''} bg_${color} p10`}
                key={color}
                onClick={(e) => {
                  _setTheme(color);
                  onChangeTheme(color);
                }} />
            );
          })
        }
      </div>
      <hr />
      <h5>黑夜模式</h5>
      <Switch defaultChecked={darkMode} onChange={onChangeDarkMode} />
      {/* <h5>是否横向布局</h5>
      <Switch
        defaultChecked={layout === 'horizontal'}
        onChange={val => onChangeLayout(_layout[!val ? 0 : 1])} /> */}
    </div>
  );
};

export default Theme;
export {
  getThemeConfig, setTheme, setLayout, setDarkMode
};
