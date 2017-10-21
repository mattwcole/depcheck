export default class NuGetClientCache {
  constructor(nuGetClient, cache) {
    this.nuGetClient = nuGetClient;
    this.cache = cache;
  }

  getVersions(packageId) {
    const key = `nuget-versions-${packageId}`;
    return this.cache.cacheFirst(key,
      () => this.nuGetClient.getVersions(packageId));
  }
}
