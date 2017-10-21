import semver from 'semver';

export const getLatestVersions = (versions) => {
  let latestStable;
  let latestPre;

  versions.forEach((version) => {
    if (semver.prerelease(version)) {
      latestPre = version;
    } else {
      latestStable = version;
    }
  });

  return {
    latestStable, latestPre,
  };
};

export const calculatePackageScore = ({ current, latestStable, latestPre }) => {
  const targetVersion = (semver.lte(current, latestStable || '0.0.0') && latestStable) || latestPre;
  const versionDiff = semver.diff(current, targetVersion);

  switch (versionDiff) {
    case null:
      return 1;
    case 'prerelease':
      return 2;
    case 'prepatch':
    case 'patch':
      return 3;
    case 'preminor':
    case 'minor':
      return 4;
    case 'premajor':
    case 'major':
      return 5;
    default:
      throw new Error(`Unknown semver diff ${versionDiff}`);
  }
};

export const calculateProjectScore = scores => Math.max(...scores);

export const calculateRepoScore = scores => Math.max(...scores);
