import fetch from 'isomorphic-fetch';
import FetchError from './FetchError';

const parseResponse = async (response) => {
  if (!response.ok) {
    throw new FetchError(
      `Request to ${response.url} failed with status "${response.statusText}"`,
      response.status, await response.text());
  }

  return response.json();
};

export default class Fetch {
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

