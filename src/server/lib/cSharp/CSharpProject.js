import { promisify } from 'util';
import xml2js from 'xml2js';
import * as versioning from '../versioning';

const parseXml = promisify(xml2js.parseString);

const getDotNetCoreDependencies = project => (project.Project.ItemGroup.reduce(
  (packages, itemGroup) => (
    itemGroup.PackageReference
      ? packages.concat(itemGroup.PackageReference.map(packageRef => ({
        id: packageRef.$.Include,
        version: packageRef.$.Version,
      })))
      : packages),
  [],
));

// const getDotNetFrameworkDependencies = (project) => {

// };

export default class CSharpProject {
  constructor(gitHubClient, nuGetClient) {
    this.gitHubClient = gitHubClient;
    this.nuGetClient = nuGetClient;
  }

  async getDependencies(owner, repo) {
    const projectFiles = await this.gitHubClient.getFilesContent(owner, repo, '*.csproj');

    const projectDependencies = await Promise.all(projectFiles.map(async (file) => {
      const project = await parseXml(file.content);

      return {
        name: file.name,
        path: file.path,
        dependencies: getDotNetCoreDependencies(project),
      };
    }));

    return projectDependencies;
  }

  async getDependencySummary(owner, repo) {
    const dependenciesByProject = await this.getDependencies(owner, repo);

    const projectScores = [];

    const dependencySummaries = await Promise.all(
      dependenciesByProject.map(async (project) => {
        const dependencySummary = await this.getProjectDependencySummary(project);
        projectScores.push(dependencySummary.score);
        return dependencySummary;
      }),
    );

    return {
      score: versioning.calculateRepoScore(projectScores),
      projects: dependencySummaries,
    };
  }

  async getProjectDependencySummary(project) {
    const packageScores = [];

    const dependencies = await Promise.all(project.dependencies.map(async (dependency) => {
      const allVersions = await this.nuGetClient.getVersions(dependency.id);
      const latestVersions = versioning.getLatestVersions(allVersions);
      const versions = Object.assign({ current: dependency.version }, latestVersions);
      const packageScore = versioning.calculatePackageScore(versions);

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
      score: versioning.calculateProjectScore(packageScores),
      dependencies,
    };
  }
}
