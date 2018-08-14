import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Link from 'react-router-dom/Link';
import Route from '../cache-router';

// let count = 0;

const CustomLink = ({ to, activeOnlyWhenExact, className, children }) => {
  let _to = '/' + to;
  return (
    <Route
      path={_to}
      exact={activeOnlyWhenExact}
      children={({location}) => {
        // const { match, location } = props;
        const isActive = _to.indexOf(location.pathname) !== -1;
        // console.log(count++)
        // const isActive = match || _to.indexOf(location.pathname) !== -1;
        // const isActive = !!match;
        // console.log(match, _to)
        return (
          <Link
            to={_to}
            className={className + (isActive ? ' active' : '')}
            style={{ color: 'inherit' }}>
            {children}
          </Link>
        );
      }}
    />
  );
};

export default CustomLink;
