import React from 'react';

import ActionAgent from '..';

export default class ActionAgentPage extends ActionAgent {
  api = (postDataFromAgent): Promise<string> => {
    console.log(postDataFromAgent);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('return api res data');
      }, 800);
    });
  }

  componentDidMount = async () => {
    const postData = {
      username: 'bee'
    };
    const reqInstance = this.reqAgent(this.api, {
      before: () => ({}),
      after: (res) => {
        console.log('return an object to merge this.state');
        return {};
      },
      actingRef: 'testing',
    });
    const resData = await reqInstance(postData);
    console.log(resData);
  }

  render() {
    const { text } = this.props;
    return (
      <div>Page of ActionAgent's demo</div>
    );
  }
}
