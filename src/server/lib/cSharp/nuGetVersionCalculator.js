import versionCalculator from 'semver';
import NuGetWildcardMatcher from './NuGetWildcardMatcher';
import NuGetRangeMatcher from './NuGetRangeMatcher';
import NuGetExactMatcher from './NuGetExactMatcher';

const prereleaseRegex = /^\d+\.\d+\.\d+\.\d+(-\S+)$/;
const versionPartsRegex = /^(\d+)(\.(\d+))?(\.(\d+))?(\.(\d+))?(-\S+)?$/;

const parseDigit = digit => parseInt(digit || '0', 10);

const getVersionParts = (version) => {
  const match = versionPartsRegex.exec(version);

  if (!match) {
    throw new TypeError(`Invalid Version: ${version}`);
  }

  return {
    major: parseDigit(match[1]),
    minor: parseDigit(match[3]),
    patch: parseDigit(match[5]),
    extra: parseDigit(match[7]),
    prerelease: match[8] || '',
  };
};

const compareStable = (parts1, parts2, comparison) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const partName of ['major', 'minor', 'patch', 'extra']) {
    const part1 = parts1[partName];
    const part2 = parts2[partName];

    if (part1 !== part2) {
      return comparison(part1, part2);
    }
  }

  return null;
};

export default {
  prerelease(version) {
    const match = prereleaseRegex.exec(version);
    if (match) {
      return match[1]
        ? versionCalculator.prerelease(`0.0.0${match[1]}`)
        : null;
    }

    return versionCalculator.prerelease(version);
  },

  eq(version1, version2) {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    // eslint-disable-next-line no-restricted-syntax
    for (const partName of ['major', 'minor', 'patch', 'extra', 'prerelease']) {
      const part1 = parts1[partName];
      const part2 = parts2[partName];

      if (part1 !== part2) {
        return false;
      }
    }

    return true;
  },

  gt(version1, version2) {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    const stableComparison = compareStable(parts1, parts2, (part1, part2) => part1 > part2);

    return stableComparison != null
      ? stableComparison
      : versionCalculator.gt(`0.0.0${parts1.prerelease}`, `0.0.0${parts2.prerelease}`);
  },

  lt(version1, version2) {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    const stableComparison = compareStable(parts1, parts2, (part1, part2) => part1 < part2);

    return stableComparison != null
      ? stableComparison
      : versionCalculator.lt(`0.0.0${parts1.prerelease}`, `0.0.0${parts2.prerelease}`);
  },

  gte(version1, version2) {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    const stableComparison = compareStable(parts1, parts2, (part1, part2) => part1 > part2);

    return stableComparison != null
      ? stableComparison
      : versionCalculator.gte(`0.0.0${parts1.prerelease}`, `0.0.0${parts2.prerelease}`);
  },

  lte(version1, version2) {
    const parts1 = getVersionParts(version1);
    const parts2 = getVersionParts(version2);

    const stableComparison = compareStable(parts1, parts2, (part1, part2) => part1 < part2);

    return stableComparison != null
      ? stableComparison
      : versionCalculator.lte(`0.0.0${parts1.prerelease}`, `0.0.0${parts2.prerelease}`);
  },

  diff(version1, version2) {
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

  satisfies(versionRange, version) {
    const rangeMatchers = [
      NuGetWildcardMatcher,
      NuGetRangeMatcher,
      NuGetExactMatcher,
    ];

    let rangeMatcher;

    if (!rangeMatchers.some((Matcher) => {
      const match = Matcher.regex.exec(version);
      if (match) {
        rangeMatcher = new Matcher(match);
        return true;
      }
      return false;
    })) {
      throw new TypeError(`Invalid Version: ${version}`);
    }

    return rangeMatcher.satisfies(version);
  },
};
