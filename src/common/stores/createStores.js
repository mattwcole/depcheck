import RepoStore from './RepoStore';

export default (state = {}) => ({
  repoStore: new RepoStore(state.repoStore),
});
