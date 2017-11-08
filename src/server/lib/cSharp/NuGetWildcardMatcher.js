import versionCalculator from './nuGetVersionCalculator';

const wildcardVersionRegex = /^(\d+|\*)(\.(\d+|\*))?(\.(\d+|\*))?(\.(\d+|\*))?(-\S+|\*)?$/;
const versionRegex = /^(\d+)(\.(\d+))?(\.(\d+))?(\.(\d+))?(-\S+)?$/;

const parseDigit = digit => (digit !== '*'
  ? parseInt(digit || '0', 10)
  : '*');

const getVersionParts = match => (
  match && {
    major: parseDigit(match[1]),
    minor: parseDigit(match[3]),
    patch: parseDigit(match[5]),
    extra: parseDigit(match[7]),
    prerelease: match[8] || '',
  }
);

export default class NuGetWildcardMatcher {
  static regex = wildcardVersionRegex;

  constructor(match) {
    this.parts = getVersionParts(match);
  }

  satisfies(version) {
    const match = versionRegex.exec(version);

    if (!match) {
      throw new TypeError(`Invalid Version: ${version}`);
    }

    const versionParts = getVersionParts(match);

    // eslint-disable-next-line no-restricted-syntax
    for (const partName of ['major', 'minor', 'patch', 'extra']) {
      const wildcardVersionPart = this.parts[partName];
      const versionPart = versionParts[partName];

      if (wildcardVersionPart !== '*' && versionPart !== wildcardVersionPart) {
        return versionPart > wildcardVersionPart;
      }
    }

    if (this.parts.prerelease !== '-*' && versionParts.prerelease !== this.parts.prerelease) {
      return versionCalculator.gt(`0.0.0${versionParts.prerelease}`, `0.0.0${this.parts.prerelease}`);
    }

    return true;
  }
}
