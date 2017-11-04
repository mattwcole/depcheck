import { promisify } from 'util';
import xml2js from 'xml2js';
import * as versioning from './nuGetVersioning';

const parseXml = promisify(xml2js.parseString);
const classicPackageRegex = /(\S+),\s+Version=(\d+\.\d+\.\d+(\.\d+)?(-\S+)?)/i;

const getModernCsprojDependencies = project => (
  project.Project.ItemGroup.reduce(
    (packages, itemGroup) => (
      itemGroup.PackageReference
        ? packages.concat(itemGroup.PackageReference.map(packageRef => ({
          id: packageRef.$.Include,
          version: packageRef.$.Version,
        })))
        : packages),
    [],
  )
);

const getClassicCsprojDependencies = project => (
  project.Project.ItemGroup.reduce(
    (packages, itemGroup) => {
      if (itemGroup.Reference) {
        itemGroup.Reference.forEach((reference) => {
          const match = classicPackageRegex.exec(reference.$.Include);
          if (match) {
            packages.push({
              id: match[1],
              version: match[2],
            });
          }
        });
      }

      return packages;
    },
    [],
  )
);

const getCsprojDependencies = (project) => {
  const isModernProject = project.Project.PropertyGroup.some(
    propertyGroup => propertyGroup.TargetFramework || propertyGroup.TargetFrameworks);

  return isModernProject
    ? getModernCsprojDependencies(project)
    : getClassicCsprojDependencies(project);
};

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
        dependencies: project.Project.ItemGroup
          ? getCsprojDependencies(project)
          : [],
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
