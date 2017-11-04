import semver from 'semver';

const prereleaseRegex = /^\d+\.\d+\.\d+\.\d+(-\S+)$/;
const versionPartsRegex = /^(\d+)\.(\d+)\.(\d+)(\.(\d+))?(-\S+)?$/;

export default {
  prerelease: (version) => {
    const match = prereleaseRegex.exec(version);
    if (match) {
      return (match[1] && semver.prerelease(`0.0.0${match[1]}`)) || null;
    }

    return semver.prerelease(version);
  },

  lte: (version1, version2) => {
    const match1 = versionPartsRegex.exec(version1);
    const match2 = versionPartsRegex.exec(version2);

    // eslint-disable-next-line no-restricted-syntax
    for (const part of [1, 2, 3, 5]) {
      const part1 = parseInt(match1[part] || '0', 10);
      const part2 = parseInt(match2[part] || '0', 10);

      if (part1 !== part2) {
        return part1 < part2;
      }
    }

    return semver.lte(`0.0.0${match1[6] || ''}`, `0.0.0${match2[6] || ''}`);
  },

  diff: (version1, version2) => {
    const match1 = versionPartsRegex.exec(version1);
    const match2 = versionPartsRegex.exec(version2);

    const prefix = match1[6] || match2[6] ? 'pre' : '';

    // eslint-disable-next-line no-restricted-syntax
    for (const part of [
      { index: 1, name: 'major' },
      { index: 2, name: 'minor' },
      { index: 3, name: 'patch' },
      { index: 5, name: 'extra' },
    ]) {
      const part1 = parseInt(match1[part.index] || '0', 10);
      const part2 = parseInt(match2[part.index] || '0', 10);

      if (part1 !== part2) {
        return `${prefix}${part.name}`;
      }
    }

    return match1[6] !== match2[6] ? 'prerelease' : null;
  },
};
