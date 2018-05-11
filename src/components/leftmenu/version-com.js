import React, { Component } from 'react';

export default class VersionDisplayer extends Component {
  constructor(props) {
    super(props);

    this.current_version = props.numberVersion.trim();
    this.errorCount = 0;
    this.state = {
      last_version: this.current_version
    };
  }

  componentDidMount() {
    this.getVersion();
    this.timer = setInterval(this.getVersion, 1000000);
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
    fetch($AWT.versionUrl + '?t=' + Date.now()) // 加时间戳是为了防止缓存
      .then(res => res.text())
      .then(res => {
        let got_version = res.trim();
        if (got_version[0] !== 'v') return; // 预防txt不存在
        if (got_version != this.state.last_version) {
          this._clear();
          !this.__unmount &&
            this.setState({
              last_version: got_version
            });
        }
      })
      .catch(e => {
        this.errorCount++;
      });
  };

  render() {
    const { last_version } = this.state;
    return (
      <span>
        {this.current_version}{' '}
        {
          last_version != this.current_version ? (
            <sup
              className={'new-app-version'}
              onClick={this.reload}
              title="有新版本，点击重新加载">
              New
            </sup>
          ) : null
        }
      </span>
    );
  }
}
