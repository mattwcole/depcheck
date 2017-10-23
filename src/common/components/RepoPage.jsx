import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('repoStore') @observer
class RepoPage extends Component {
  static preRender({ repoStore, match: { params: { owner, name } } }) {
    return repoStore.getDependencies(owner, name);
  }

  static propTypes = {
    repoStore: PropTypes.shape({
      dependencies: PropTypes.object,
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
        <p>{JSON.stringify(this.repoStore.dependencies)}</p>
      </div>
    );
  }
}

export default RepoPage;
