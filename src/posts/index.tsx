import React, { Component } from 'react';
import { DebounceClass } from '@mini-code/base-func';

const delayExec = new DebounceClass();

const wrapUrl = (str) => {
  if (!str) return null;
  const strArr = str.replace('?', '');
  return `./posts/${strArr}.html`;
};

export default class Posts extends Component {
  state = {
    markdownHTML: '',
    iframeSrc: ''
  }

  async fetchPostData(fileHashName) {
    const res = await (await fetch(fileHashName)).text();
    this.setState({
      markdownHTML: res
    });
  }

  componentWillReceiveProps(nextProps) {
    delayExec.exec(() => {
      this.fetchPostData(wrapUrl(nextProps.location.search));
    }, 20);
    // this.setState({
    //   iframeSrc: nextProps.location.search
    // });
  }

  componentDidMount() {
    this.fetchPostData(wrapUrl(this.props.location.search));
    // this.setState({
    //   iframeSrc: this.props.location.search
    // });
  }

  createMarkup() {
    return {
      __html: this.state.markdownHTML
    };
  }

  render() {
    const { iframeSrc } = this.state;
    // return iframeSrc ? (
    //   // <iframe src={wrapUrl(iframeSrc)} frameBorder="0" width="100%" height="100%"></iframe>
    //   <div className="markdown-body" dangerouslySetInnerHTML={this.createMarkup()}></div>
    // ) : null
    return (
      <div className="markdown-body" dangerouslySetInnerHTML={this.createMarkup()} />
    );
  }
}
