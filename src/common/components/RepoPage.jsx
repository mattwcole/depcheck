import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { STORE_NAME } from '../stores/RepoStore';

const initStore = store => store.fetchDependencySummary();

@inject(STORE_NAME) @observer
class RepoPage extends Component {
  static preServerRender(stores) {
    return initStore(stores[STORE_NAME]);
  }

  componentWillMount() {
    initStore(this.store);
  }

  store = this.props[STORE_NAME]

  render() {
    return (
      <div className="container">
        <h1 className="title">Repo</h1>
        <p>The value from the store is {this.store.value}.</p>
      </div>
    );
  }
}

export default RepoPage;
