import semver from 'semver';
import VersionError from './VersionError';

const prereleaseRegex = /^\d+\.\d+\.\d+\.\d+(-\S+)$/;
const versionPartsRegex = /^(\d+)\.(\d+)\.(\d+)(\.(\d+))?(-\S+)?$/;

const parseDigit = digit => parseInt(digit || '0', 10);

const getVersionParts = (version) => {
  const match = versionPartsRegex.exec(version);

  if (!match) {
    throw new VersionError(`${version} is not a valid 3/4 digit version.`, version);
  }

  return {
    major: parseDigit(match[1]),
    minor: parseDigit(match[2]),
    patch: parseDigit(match[3]),
    extra: parseDigit(match[5]),
    prerelease: match[6] || '',
  };
};

export default {
  prerelease: (version) => {
    const match = prereleaseRegex.exec(version);
    if (match) {
      return match[1]
        ? semver.prerelease(`0.0.0${match[1]}`)
        : null;
    }

    return semver.prerelease(version);
  },

  lte: (version1, version2) => {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    // eslint-disable-next-line no-restricted-syntax
    for (const partName of ['major', 'minor', 'patch', 'extra']) {
      const part1 = parts1[partName];
      const part2 = parts2[partName];

      if (part1 !== part2) {
        return part1 < part2;
      }
    }

    return semver.lte(`0.0.0${parts1.prerelease}`, `0.0.0${parts2.prerelease}`);
  },

  diff: (version1, version2) => {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    const prefix = (parts1.prerelease || parts2.prerelease) ? 'pre' : '';

    // eslint-disable-next-line no-restricted-syntax
    for (const partName of ['major', 'minor', 'patch', 'extra']) {
      const part1 = parts1[partName];
      const part2 = parts2[partName];

      if (part1 !== part2) {
        return `${prefix}${partName}`;
      }
    }

    return parts1.prerelease !== parts2.prerelease ? 'prerelease' : null;
  },
};
