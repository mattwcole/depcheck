import parseXml from '../xmlParser';
import PropsResolver from './PropsResolver';

// TODO: Make other regex patterns use non capturing groups.

// eslint-disable-next-line no-useless-escape
const classicPackageRegex = /packages(?:\\|\/)([\.\-\w]+?)\.(\d+\.\d+\.\d+(?:\.\d+)?(?:-[\.\-\w]+)?)(?:\\|\/)/i;
const propRegex = /^\$\((\S+)\)$/;

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

const getClassicCsprojDependencies = (project) => {
  const packageHash = {};

  return project.Project.ItemGroup.reduce(
    (packages, itemGroup) => {
      if (itemGroup.Reference) {
        itemGroup.Reference.forEach((reference) => {
          const match = reference.HintPath && classicPackageRegex.exec(reference.HintPath);
          if (match) {
            const packageId = match[1];
            const packageVersion = match[2];

            const existingVersion = packageHash[packageId];
            if (existingVersion) {
              if (existingVersion !== packageVersion) {
                throw new Error(`Project contains references to ${packageId} ` +
                  `versions ${existingVersion} and ${packageVersion}`);
              }
            } else {
              packageHash[packageId] = packageVersion;

              packages.push({
                id: packageId,
                version: packageVersion,
              });
            }
          }
        });
      }

      return packages;
    },
    [],
  );
};

export default class CSharpProject {
  constructor(gitHubClient, nuGetClient, versionUtils) {
    this.gitHubClient = gitHubClient;
    this.nuGetClient = nuGetClient;
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
    const projectFiles = await this.gitHubClient.getFilesContent(owner, repo, '*.csproj');
    const propsResolver = new PropsResolver(owner, repo, this.gitHubClient);

    const projectDependencies = await Promise.all(projectFiles.map(async (projectFile) => {
      const project = await parseXml(projectFile.content);

      const isModernProject = project.Project.PropertyGroup && project.Project.PropertyGroup.some(
        propertyGroup => propertyGroup.TargetFramework || propertyGroup.TargetFrameworks);

      let dependencies = [];
      if (project.Project.ItemGroup) {
        if (isModernProject) {
          dependencies = getModernCsprojDependencies(project);

          await Promise.all(dependencies.map(async (dependency) => {
            const propMatch = propRegex.exec(dependency.version);
            if (propMatch) {
              // eslint-disable-next-line no-param-reassign
              dependency.version = await propsResolver.getValue(propMatch[1]);
            }
          }));
        } else {
          dependencies = getClassicCsprojDependencies(project);
        }
      }

      return {
        name: projectFile.name,
        path: projectFile.path,
        isClassic: !isModernProject,
        dependencies,
      };
    }));

    return projectDependencies;
  }

  async getProjectDependencySummary(project) {
    const packageScores = [];

    const dependencies = await Promise.all(project.dependencies.map(async (dependency) => {
      const allVersions = await this.nuGetClient.getVersions(dependency.id);
      const latestVersions = this.versionUtils.getLatestVersions(allVersions);
      const versions = {
        display: dependency.version,
        effective: project.isClassic
          ? dependency.version
          : this.versionUtils.getEffectiveVersion(dependency.version, allVersions),
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
