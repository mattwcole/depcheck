import versionCalculator from './nuGetVersionCalculator';

export default class NuGetRangeMatcher {
  // eslint-disable-next-line no-useless-escape
  static regex = /^([\[\(])(\S+)?,\s*(\S+)?([\]\)])$/;

  constructor(match) {
    this.openingBracket = match[1];
    this.minVersion = match[2];
    this.maxVersion = match[3];
    this.closingBracket = match[4];
  }

  satisfies(version) {
    if (versionCalculator.prerelease(version)) {
      return false;
    }

    let pass = true;

    if (this.openingBracket === '[') {
      pass = pass && versionCalculator.gte(version, this.minVersion);
    } else if (this.openingBracket === '(') {
      if (this.minVersion) {
        pass = pass && versionCalculator.gt(version, this.minVersion);
      }
    }

    if (this.closingBracket === ']') {
      pass = pass && versionCalculator.lte(version, this.maxVersion);
    } else if (this.closingBracket === ')') {
      if (this.maxVersion) {
        pass = pass && versionCalculator.lt(version, this.maxVersion);
      }
    }

    return pass;
  }
}
