import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from './LoadingSpinner';
import DependencySummary from './DependencySummary';

@inject('repoStore') @observer
class DependenciesPage extends Component {
  static preRender({ repoStore, match: { params: { owner, name } } }) {
    return repoStore.getDependencies(owner, name);
  }

  static propTypes = {
    repoStore: PropTypes.shape({
      repo: PropTypes.object.isRequired,
    }).isRequired,
  }

  componentWillMount() {
    DependenciesPage.preRender(this.props);
  }

  repoStore = this.props.repoStore

  render() {
    return (
      <div className="container">
        <h1 className="title">Dependencies</h1>
        {this.repoStore.loading
          ? (
            <div className="has-text-centered">
              <LoadingSpinner />
            </div>
          )
          : <DependencySummary dependencies={this.repoStore.repo} />}
      </div>
    );
  }
}

export default DependenciesPage;
