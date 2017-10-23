import { observable, action, toJS } from 'mobx';
import * as depcheckClient from '../lib/depcheckClient';

export default class RepoStore {
  @observable dependencies;

  constructor(state) {
    if (state) {
      this.dependencies = state.dependencies;
    }
  }

  @action
  async getDependencies(owner, name) {
    if (!this.dependencies) {
      this.dependencies = await depcheckClient.getRepoDependencies(owner, name);
    }
  }

  toJS() {
    return toJS({
      dependencies: this.dependencies,
    });
  }
}
