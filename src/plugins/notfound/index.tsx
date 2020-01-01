import React from 'react';
import { Icon } from '../../ui-refs';

const NotFound = () => {
  return (
    <div className="card-content">
      <div className="p20">
        <div
          className="text-center"
          style={{
            fontSize: 40,
            color: '#DDD'
          }}
        >
          <Icon n="hiking" classNames={['mr20']} />
          Not Found
        </div>
      </div>
    </div>
  );
};

export default NotFound;
