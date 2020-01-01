import React, { useState } from 'react';
import Storage from '@mini-code/base-func/storage';

import { $T } from '@deer-ui/core/utils/config';
import { Switch, Grid } from '../ui-refs';

const _themes = ["blue", "light-blue", "cyan", "green", "yellow", "orange", "red", "purple"];
const _layout = ['vertical', 'horizontal'];

const themeDefined = '_THEME_';
const layoutDefined = '_LAYOUT_';
const darkModeDefined = '_DARK_MODE_';

const getThemeConfig = () => {
  const theme = Storage.getItem(themeDefined);
  const layout = Storage.getItem(layoutDefined);
  const darkMode = Storage.getItem(darkModeDefined);

  return {
    theme,
    layout,
    darkMode: darkMode == 'true'
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

class Theme extends React.PureComponent {
  state = {
    activeTheme: this.props.activeTheme
  }

  setTheme = (activeTheme) => {
    this.setState({
      activeTheme
    });
  }

  render() {
    const {
      darkMode, layout,
      onChangeDarkMode, onChangeTheme, onChangeLayout
    } = this.props;
    const { activeTheme } = this.state;
    return (
      <div className="theme-changer">
        <p className="control-label">主题选择</p>
        <Grid container alignItems="center" space={10}>
          {
            _themes.map((color) => {
              const isActive = activeTheme === color;
              return (
                <Grid
                  key={color}
                  lg={3}
                  xl={3}
                >
                  <span
                    className={`tile ${isActive ? 'active' : ''} bg_${color} p10`}
                    onClick={(e) => {
                      this.setTheme(color);
                      onChangeTheme(color);
                    }}
                  />
                </Grid>
              );
            })
          }
        </Grid>
        <hr />
        <div className="form-group layout a-i-c">
          <span className="control-label mr10">
            {$T('黑夜模式')}
          </span>
          <span className="control-continer">
            <Switch
              hints={['on', 'off']}
              defaultChecked={darkMode}
              onChange={onChangeDarkMode}
            />
          </span>
        </div>
        {/* <div className="form-group layout a-i-c">
          <span className="control-label mr10">
            {$T('宽屏模式')}
          </span>
          <span className="control-continer">
            <Switch
              hints={['on', 'off']}
              defaultChecked={darkMode}
              onChange={onChangeDarkMode}
            />
          </span>
        </div> */}
        {/* <h5>是否横向布局</h5>
          <Switch
            defaultChecked={layout === 'horizontal'}
            onChange={val => onChangeLayout(_layout[!val ? 0 : 1])} /> */}
      </div>
    );
  }
}

export default Theme;
export {
  getThemeConfig, setTheme, setLayout, setDarkMode
};
