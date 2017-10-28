import { observable, action, runInAction, toJS } from 'mobx';
import * as depcheckClient from '../lib/depcheckClient';

export default class RepoStore {
  @observable dependencies;

  constructor(state, errorStore) {
    if (state) {
      this.dependencies = state.dependencies;
    }

    this.errorStore = errorStore;
  }

  @action
  async getDependencies(owner, name) {
    if (!this.dependencies) {
      try {
        const dependencies = await depcheckClient.getRepoDependencies(owner, name);

        runInAction(() => {
          this.dependencies = dependencies;
        });
      } catch (error) {
        this.errorStore.setError(error);
      }
    }
  }

  toJS() {
    return toJS({
      dependencies: this.dependencies,
    });
  }
}
