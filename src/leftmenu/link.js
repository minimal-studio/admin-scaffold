import PropTypes from 'prop-types';
import React, { Component } from 'react';

const CustomLink = ({ to, className = '', children }) => {
  const isActive = location.pathname != '/' && _to.indexOf(location.pathname) !== -1;
  return (
    <span className={className + (isActive ? ' active' : '')}>
      {children}
    </span>
  )
};

export default CustomLink;
