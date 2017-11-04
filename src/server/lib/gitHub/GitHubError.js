export default class GitHubError extends Error {
  constructor(message, errors) {
    super(message);

    this.errors = errors;

    Error.captureStackTrace(this, GitHubError);
  }
}
