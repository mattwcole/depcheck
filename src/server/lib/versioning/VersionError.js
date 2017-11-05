export default class VersionError extends Error {
  constructor(message, version) {
    super(message);

    this.version = version;

    Error.captureStackTrace(this, VersionError);
  }
}
