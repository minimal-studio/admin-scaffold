import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Link from 'react-router-dom/Link';
import Route from '../cache-router';

const CustomLink = ({ to, activeOnlyWhenExact, className, children }) => {
  to = '/' + to;
  return (
    <Route
      path={to}
      exact={activeOnlyWhenExact}
      children={({ match }) => {
        return (
          <Link
            to={to}
            className={className + (match ? ' active' : '')}
            style={{ color: 'inherit' }}
          >
            {children}
          </Link>
        );
      }}
    />
  );
};

export default CustomLink;
