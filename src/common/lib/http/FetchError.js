export default class FetchError extends Error {
  constructor(message, status, response) {
    super(message);

    this.status = status;
    this.response = response;

    Error.captureStackTrace(this, FetchError);
  }
}
