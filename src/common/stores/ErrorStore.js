import { observable, action } from 'mobx';
import Errio from 'errio';

export default class ErrorStore {
  @observable error;

  constructor(state) {
    if (state && state.error) {
      this.error = Errio.fromObject(state.error);
    }
  }

  @action
  setError(error) {
    this.error = error;
  }

  toJS() {
    return {
      error: this.error && Errio.toObject(this.error),
    };
  }
}
