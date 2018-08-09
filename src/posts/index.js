import React, {Component} from 'react';
import {DebounceClass} from 'basic-helper';
// import showdown from 'showdown';

// let converter = new showdown.Converter();
let delayExec = new DebounceClass();

// converter.setOption('tables', true);

// function decodeStr(str) {
//   let res = '';
//   try {
//     res = decodeURIComponent(escape(atob(str)));
//   } catch(e) {
//     // console.log(e)
//   }
//   return res;
// }

// const decode = (str) => {
//   let strArr = str.replace('?', '').split('&&');
//   strArr = strArr.map(s => s && decodeStr(s)).join('/');
//   return '/posts/' + strArr;
// };
const wrapUrl = (str) => {
  let strArr = str.replace('?', '');
  return './posts/' + strArr + '.html';
};

export default class Posts extends Component {
  state = {
    markdownHTML: ''
  }
  async fetchPostData(fileHashName) {
    let res = await (await fetch(fileHashName)).text();
    this.setState({
      markdownHTML: res
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props.location.search)
    delayExec.exec(() => {
      this.fetchPostData(wrapUrl(nextProps.location.search));
    }, 20);
  }
  componentDidMount() {
    this.fetchPostData(wrapUrl(this.props.location.search));
  }
  createMarkup() {
    return {
      __html: this.state.markdownHTML
    }
  }
  render() {
    return (
      <div className="markdown-body" dangerouslySetInnerHTML={this.createMarkup()}></div>
    )
  }
}
