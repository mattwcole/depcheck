export default class GitHubClientCache {
  constructor(gitHubClient, cache) {
    this.gitHubClient = gitHubClient;
    this.cache = cache;
  }

  // TODO: Support both operations in a single call for less trips to cache.

  getLanguage(owner, repo) {
    const key = `github-language-${owner}/${repo}`;
    return this.cache.cacheFirst(key,
      () => this.gitHubClient.getLanguage(owner, repo));
  }

  getFilesContent(owner, repo, filename) {
    const key = `github-files-content-${owner}/${repo}-${filename}`;
    return this.cache.cacheFirst(key,
      () => this.gitHubClient.getFilesContent(owner, repo, filename));
  }
}
