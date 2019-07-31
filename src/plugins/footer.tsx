import React, { Component } from 'react';

const Foooter = (props) => {
  const { children } = props;
  return (
    <div className="footer-container">
      {children}
    </div>
  );
};

export default Foooter;
