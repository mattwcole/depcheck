import VersionUtils from '../VersionUtils';

export default class NuGetVersionUtils extends VersionUtils {
  getEffectiveVersion(displayVersion, allVersions) {
    let matchingVersion;

    allVersions.some((version) => {
      if (this.versionCalculator.satisfies(displayVersion, version)) {
        matchingVersion = version;
        return true;
      }
      return false;
    });

    return matchingVersion;
  }
}
