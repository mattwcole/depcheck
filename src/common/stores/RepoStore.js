import { observable, action, toJS } from 'mobx';

export default class RepoStore {
  @observable value = 'empty';

  constructor(state) {
    if (state) {
      this.value = state.value;
    }
  }

  @action
  async fetchDependencySummary() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.value = new Date().toString();
  }

  toJS() {
    return toJS({
      value: this.value,
    });
  }
}
