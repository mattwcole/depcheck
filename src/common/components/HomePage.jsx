import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RepoSearch from './RepoSearch';

export default class HomePage extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }

  onRepoSearch = (owner, name) => {
    this.context.router.history.push(`/repos/${owner}/${name}`);
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Depcheck</h1>
        <p className="subtitle">
          Check your <strong>GitHub</strong> project dependencies
        </p>
        <RepoSearch onSearch={this.onRepoSearch} />
      </div>
    );
  }
}
