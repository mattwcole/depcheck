import semver from '../versioning/extendedSemver';

export default class RangeVersionMatcher {
  // eslint-disable-next-line no-useless-escape
  static regex = /^([\[\(])(\S+)?,\s*(\S+)?([\]\)])$/;

  constructor(match) {
    this.openingBracket = match[1];
    this.minVersion = match[2];
    this.maxVersion = match[3];
    this.closingBracket = match[4];
  }

  satisfies(version) {
    if (semver.prerelease(version)) {
      return false;
    }

    let pass = true;

    if (this.openingBracket === '[') {
      pass = pass && semver.gte(version, this.minVersion);
    } else if (this.openingBracket === '(') {
      if (this.minVersion) {
        pass = pass && semver.gt(version, this.minVersion);
      }
    }

    if (this.closingBracket === ']') {
      pass = pass && semver.lte(version, this.maxVersion);
    } else if (this.closingBracket === ')') {
      if (this.maxVersion) {
        pass = pass && semver.lt(version, this.maxVersion);
      }
    }

    return pass;
  }
}
