import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tip, ShowModal, TipPanel } from './ui-refs';

export default class VersionDisplayer extends Component {
  static propTypes = {
    gm: PropTypes.func.isRequired,
    /** 版本内容 */
    versionInfo: PropTypes.shape({
      numberVersion: PropTypes.string,
      updateLog: PropTypes.string,
    }).isRequired,
  }
  constructor(props) {
    super(props);

    let { numberVersion } = props.versionInfo;

    numberVersion = numberVersion.trim();
    this.errorCount = 0;

    this.state = {
      currVersion: numberVersion,
      lastVersion: numberVersion,
    };
  }

  componentDidMount() {
    this.getVersion();
    this.timer = setInterval(this.getVersion, 30 * 60 * 1000);
  }

  componentWillUnmount() {
    this.__unmount = true;
    this._clear();
  }

  _clear = () => {
    this.timer && clearInterval(this.timer);
  };

  getVersion = () => {
    if (this.errorCount === 5) return this._clear();
    fetch(window.$AWT.versionUrl + '?t=' + Date.now())
      .then(res => res.json())
      .then(remoteVersion => {
        let { numberVersion, updateLog } = remoteVersion;
        numberVersion = numberVersion.trim();
        if (numberVersion != this.state.lastVersion) {
          this._clear();
          !this.__unmount && this.setState({
            lastVersion: numberVersion,
            updateLog
          });
        }
      })
      .catch(e => {
        this.errorCount++;
      });
  };

  reload = () => {
    const { updateLog, lastVersion } = this.state;
    ShowModal({
      title: '是否更新版本？',
      type: 'confirm',
      width: 400,
      confirmText: (
        <div>
          <div>
            <h4>更新内容:</h4>
            <p>{updateLog || '日常更新'}</p>
          </div>
          <hr />
          <TipPanel
            type="success"
            text="请确保已保存工作内容，页面即将刷新" />
        </div>
      ),
      onConfirm: isSure => {
        if(isSure) {
          location.reload();
        }
      },
    })
  }

  render() {
    const { currVersion, lastVersion, updateLog } = this.state;
    const { gm } = this.props;
    const hasNewVersion = lastVersion != currVersion;
    return (
      <span className={"version-container" + (hasNewVersion ? ' active' : '')}>
        {
          hasNewVersion ? (
            <div>
              <Tip/>
              <sup
                className="new-app-version"
                onClick={this.reload}
                title={gm("有新版本")}>
                {gm('新版本')}
                {lastVersion}
              </sup>
            </div>
          ) : null
        }
        <span>
          {gm('当前版本')} 
          {currVersion}
        </span>
      </span>
    );
  }
}
