import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tip } from 'ukelli-ui';

export default class VersionDisplayer extends Component {
  static propTypes = {
    gm: PropTypes.func.isRequired,
    versionInfo: PropTypes.object.isRequired,
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
    this.timer = setInterval(this.getVersion, 100 * 1000);
  }

  componentWillUnmount() {
    this.__unmount = true;
    this._clear();
  }

  _clear = () => {
    this.timer && clearInterval(this.timer);
  };

  reload() {
    location.reload();
  }

  getVersion = () => {
    if (this.errorCount === 5) return this._clear();
    fetch($AWT.versionUrl + '?t=' + Date.now())
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

  render() {
    const { currVersion, lastVersion, updateLog } = this.state;
    const { gm } = this.props;
    return (
      <span className="version-container">
        {
          lastVersion != currVersion ? (
            <div>
              <Tip/>
              <sup
                className="new-app-version"
                onClick={this.reload}
                title={gm("有新版本，点击重新加载，新版本说明: ") + updateLog}>
                {gm('新版本')}{lastVersion}
              </sup>
            </div>
          ) : null
        }
        <span>{gm('当前版本')} {currVersion} </span>
      </span>
    );
  }
}
