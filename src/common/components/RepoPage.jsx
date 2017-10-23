import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

const initStore = (repoStore, project) => repoStore.fetchDependencySummary(project);

@inject('repoStore') @observer
class RepoPage extends Component {
  static preRender({ repoStore, match: { params: project } }) {
    return initStore(repoStore, project);
  }

  static propTypes = {
    repoStore: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }).isRequired,
  }

  componentWillMount() {
    RepoPage.preRender(this.props);
  }

  repoStore = this.props.repoStore

  render() {
    return (
      <div className="container">
        <h1 className="title">Repo</h1>
        <p>The value from the store is {this.repoStore.value}.</p>
      </div>
    );
  }
}

export default RepoPage;
