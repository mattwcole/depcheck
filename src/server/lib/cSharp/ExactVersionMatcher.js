import semver from '../versioning/extendedSemver';

export default class ExactVersionMatcher {
  static regex = /^\[(\S+)\]$/;

  constructor(match) {
    this.version = match[1];
  }

  satisfies(version) {
    return semver.eq(version, this.version);
  }
}
