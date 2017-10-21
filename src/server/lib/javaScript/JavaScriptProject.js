export default class JavaScriptProject {
  constructor(gitHubClient, nuGetClient) {
    this.gitHubClient = gitHubClient;
    this.nuGetClient = nuGetClient;
  }

  async getDependencySummary(owner, repo) {
    const projectFiles = await this.gitHubClient.getFilesContent(owner, repo, 'package.json');
    return projectFiles;
  }
}
