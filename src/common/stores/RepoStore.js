import { observable, action, runInAction, toJS } from 'mobx';
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
      const dependencies = await depcheckClient.getRepoDependencies(owner, name);

      runInAction(() => {
        this.dependencies = dependencies;
      });
    }
  }

  toJS() {
    return toJS({
      dependencies: this.dependencies,
    });
  }
}
