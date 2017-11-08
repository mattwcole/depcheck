export default class JavaScriptProject {
  constructor(gitHubClient, npmClient, versionUtils) {
    this.gitHubClient = gitHubClient;
    this.npmClient = npmClient;
    this.versionUtils = versionUtils;
  }

  async getRepoDependencySummary(owner, repo) {
    const dependenciesByProject = await this.getDependenciesByProject(owner, repo);
    const projectScores = [];

    const dependencySummaries = await Promise.all(
      dependenciesByProject.map(async (project) => {
        const dependencySummary = await this.getProjectDependencySummary(project);
        projectScores.push(dependencySummary.score);
        return dependencySummary;
      }),
    );

    return {
      score: this.versionUtils.calculateRepoScore(projectScores),
      projects: dependencySummaries,
    };
  }

  async getDependenciesByProject(owner, repo) {
    const projectFiles = await this.gitHubClient.getFilesContent(owner, repo, 'package.json');

    const projectDependencies = projectFiles.map((projectFile) => {
      const project = JSON.parse(projectFile.content);

      return {
        name: project.name,
        path: projectFile.path,
        dependencies: Object.entries(project.dependencies).map(entry => ({
          id: entry[0],
          version: entry[1],
        })),
        devDependencies: project.devDependencies,
        peerDependencies: project.peerDependencies,
        optionalDependencies: project.optionalDependencies,
      };
    });

    return projectDependencies;
  }

  async getProjectDependencySummary(project) {
    const packageScores = [];

    const dependencies = await Promise.all(project.dependencies.map(async (dependency) => {
      const allVersions = await this.npmClient.getVersions(dependency.id);
      const latestVersions = this.versionUtils.getLatestVersions(allVersions);
      const versions = {
        display: dependency.version,
        effective: this.versionUtils.getEffectiveVersion(dependency.version, allVersions),
        ...latestVersions,
      };

      const packageScore = this.versionUtils.calculatePackageScore(versions);
      packageScores.push(packageScore);

      return {
        id: dependency.id,
        versions,
        score: packageScore,
      };
    }));

    return {
      name: project.name,
      path: project.path,
      score: this.versionUtils.calculateProjectScore(packageScores),
      dependencies,
    };
  }
}
