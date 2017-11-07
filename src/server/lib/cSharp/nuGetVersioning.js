import semver from '../versioning/extendedSemver';
import VersionError from '../versioning/VersionError';
import versionMatcherFactory from './versionMatcherFactory';

export const getLatestVersions = (allVersions) => {
  let latestStable;
  let latestPre;

  for (let i = allVersions.length - 1; i >= 0 && !(latestStable && latestPre); i -= 1) {
    const version = allVersions[i];

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

// https://docs.microsoft.com/en-us/nuget/reference/package-versioning#version-ranges-and-wildcards
export const getEffectiveVersion = (displayVersion, allVersions) => {
  const versionMatcher = versionMatcherFactory(displayVersion);

  let matchingVersion;
  allVersions.some((version) => {
    if (versionMatcher.satisfies(version)) {
      matchingVersion = version;
      return true;
    }
    return false;
  });

  return matchingVersion;
};

export const calculatePackageScore = ({ effective, latestStable, latestPre }) => {
  let versionDiff;

  try {
    const targetVersion = semver.lte(effective, latestStable || '0.0.0')
      ? latestStable
      : latestPre;

    if (!targetVersion) {
      return 0;
    }

    versionDiff = semver.diff(effective, targetVersion);
  } catch (error) {
    if (error instanceof VersionError) {
      return 0;
    }
    throw error;
  }

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
