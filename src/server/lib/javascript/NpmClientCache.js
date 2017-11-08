export default class NpmClientCache {
  constructor(npmClient, cache) {
    this.npmClient = npmClient;
    this.cache = cache;
  }

  // TODO: Support batch gets for less trips to cache.

  getVersions(packageId) {
    const key = `npm-versions-${packageId}`;
    return this.cache.cacheFirst(key,
      () => this.npmClient.getVersions(packageId));
  }
}
