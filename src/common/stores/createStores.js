import { useStrict } from 'mobx';
import RepoStore from './RepoStore';

useStrict(true);

export default (state = {}) => ({
  repoStore: new RepoStore(state.repoStore),
});
