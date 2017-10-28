import { useStrict } from 'mobx';
import ErrorStore from './ErrorStore';
import RepoStore from './RepoStore';

useStrict(true);

export default (state = {}) => {
  const errorStore = new ErrorStore(state.errorStore);

  return {
    errorStore,
    repoStore: new RepoStore(state.repoStore, errorStore),
  };
};
