import { observable, action, runInAction, toJS } from 'mobx';
import * as depcheckClient from '../lib/depcheckClient';

export default class RepoStore {
  @observable.ref repo = {};
  @observable loading = false;

  constructor(state, errorStore) {
    if (state) {
      this.repo = { ...state };
    }

    this.errorStore = errorStore;
  }

  @action
  async getDependencies(owner, name) {
    if (this.repo.owner === owner && this.repo.name === name) {
      return;
    }

    this.loading = true;

    try {
      const summary = await depcheckClient.getRepoDependencies(owner, name);

      runInAction(() => {
        this.repo = {
          owner, name, summary,
        };
      });
    } catch (error) {
      this.errorStore.setError(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  toJS() {
    return toJS(this.repo || {});
  }
}
