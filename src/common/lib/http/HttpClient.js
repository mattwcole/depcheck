import fetch from 'isomorphic-fetch';
import HttpError from './HttpError';

const parseResponse = async (response) => {
  if (!response.ok) {
    // TODO: Check Content-Type and try to parse JSON/XML.
    throw new HttpError(
      `Request to ${response.url} failed with status "${response.statusText}"`,
      response.status, await response.text());
  }

  return response.json();
};

export default class HttpClient {
  constructor(options = {}) {
    this.options = options;
  }

  defaultHeaders = {
    Accept: 'application/json',
  };

  getUrl(path) {
    return `${this.options.baseAddress || ''}${path}`;
  }

  async getJson(path) {
    const { headers } = this.options;

    const response = await fetch(this.getUrl(path), {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    });

    return parseResponse(response);
  }

  async postJson(path, content) {
    const { headers } = this.options;

    const response = await fetch(this.getUrl(path), {
      method: 'POST',
      body: JSON.stringify(content),
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...headers,
      },
    });

    return parseResponse(response);
  }
}
