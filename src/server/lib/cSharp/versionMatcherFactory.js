import WildcardVersionMatcher from './WildcardVersionMatcher';
import RangeVersionMatcher from './RangeVersionMatcher';
import ExactVersionMatcher from './ExactVersionMatcher';
import VersionError from '../versioning/VersionError';

export default (version) => {
  const versionMatchers = [
    WildcardVersionMatcher,
    RangeVersionMatcher,
    ExactVersionMatcher,
  ];

  let versionMatcher;
  if (!versionMatchers.some((Matcher) => {
    const match = Matcher.regex.exec(version);
    if (match) {
      versionMatcher = new Matcher(match);
      return true;
    }
    return false;
  })) {
    throw new VersionError(`Unrecognised version format: ${version}`, version);
  }

  return versionMatcher;
};
