import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const Status = ({ code, children }) => (
  <Route render={
    ({ staticContext }) => {
      if (staticContext) {
        // eslint-disable-next-line no-param-reassign
        staticContext.status = code;
      }
      return children;
    }}
  />
);

Status.propTypes = {
  code: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export default Status;
