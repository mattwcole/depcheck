import RepoStore from './RepoStore';

export default (state = {}) => (Object.assign(
  ...[
    RepoStore,
  ].map(Store => ({ [Store.storeName]: new Store(state[Store.storeName]) }))));
