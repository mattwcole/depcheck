import versionCalculator from './nuGetVersionCalculator';

export default class NuGetExactMatcher {
  static regex = /^\[(\S+)\]$/;

  constructor(match) {
    this.version = match[1];
  }

  satisfies(version) {
    return versionCalculator.eq(version, this.version);
  }
}
