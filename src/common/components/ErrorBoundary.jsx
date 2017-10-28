import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Status from './Status';

@inject('errorStore') @observer
export default class ErrorBoundary extends Component {
  static propTypes = {
    errorStore: PropTypes.shape({
      error: PropTypes.instanceOf(Error),
      setError: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
  }

  errorStore = this.props.errorStore;

  componentDidCatch(error) {
    this.errorStore.setError(error);
  }

  render() {
    const { error } = this.errorStore;

    return error
      ? (
        <Status code={500}>
          <h1>{error.toString()}</h1>
        </Status>
      )
      : this.props.children;
  }
}
