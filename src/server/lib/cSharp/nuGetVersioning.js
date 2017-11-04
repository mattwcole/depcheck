import semver from '../extendedSemver';

export const getLatestVersions = (versions) => {
  let latestStable;
  let latestPre;

  for (let i = versions.length - 1; i >= 0 && !(latestStable && latestPre); i -= 1) {
    const version = versions[i];

    if (semver.prerelease(version)) {
      latestPre = latestPre || version;
    } else {
      latestStable = latestStable || version;
    }
  }

  return {
    latestStable, latestPre,
  };
};

export const calculatePackageScore = ({ current, latestStable, latestPre }) => {
  // TODO: The current version may be a range or contain wildcards.
  // https://docs.microsoft.com/en-us/dotnet/core/tools/csproj#additions
  // https://docs.microsoft.com/en-gb/nuget/reference/package-versioning#version-ranges-and-wildcards

  const targetVersion = semver.lte(current, latestStable || '0.0.0')
    ? latestStable
    : latestPre;

  if (!targetVersion) {
    return 0;
  }

  const versionDiff = semver.diff(current, targetVersion);

  switch (versionDiff) {
    case null:
      return 1;
    case 'prerelease':
      return 2;
    case 'preextra':
    case 'extra':
      return 3;
    case 'prepatch':
    case 'patch':
      return 4;
    case 'preminor':
    case 'minor':
      return 5;
    case 'premajor':
    case 'major':
      return 6;
    default:
      throw new Error(`Unknown semver diff ${versionDiff}`);
  }
};

export const calculateProjectScore = packageScores => Math.max(...packageScores);

export const calculateRepoScore = projectScores => Math.max(...projectScores);
