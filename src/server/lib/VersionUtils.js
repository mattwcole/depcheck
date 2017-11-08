export default class VersionUtils {
  constructor(versionCalculator) {
    this.versionCalculator = versionCalculator;
  }

  getLatestVersions(allVersions) {
    let latestStable;
    let latestPre;

    for (let i = allVersions.length - 1; i >= 0 && !(latestStable && latestPre); i -= 1) {
      const version = allVersions[i];

      if (this.versionCalculator.prerelease(version)) {
        latestPre = latestPre || version;
      } else {
        latestStable = latestStable || version;
      }
    }

    return {
      latestStable, latestPre,
    };
  }

  getEffectiveVersion(versionRange, allVersions) {
    let matchingVersion;

    for (let i = allVersions.length; i >= 0; i -= 1) {
      const version = allVersions[i];

      if (this.versionCalculator.satisfies(version, versionRange)) {
        matchingVersion = version;
        break;
      }
    }

    return matchingVersion;
  }

  calculatePackageScore({ effective, latestStable, latestPre }) {
    let versionDiff;

    try {
      const targetVersion = this.versionCalculator.lte(effective, latestStable || '0.0.0')
        ? latestStable
        : latestPre;

      if (!targetVersion) {
        return 0;
      }

      versionDiff = this.versionCalculator.diff(effective, targetVersion);
    } catch (error) {
      if (error instanceof TypeError && error.message.startsWith('Invalid Version')) {
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
  }

  calculateProjectScore = packageScores => Math.max(...packageScores);

  calculateRepoScore = projectScores => Math.max(...projectScores);
}
