import HttpClient from '../../../common/lib/http/HttpClient';
import HttpError from '../../../common/lib/http/HttpError';

export default class NpmClient {
  constructor() {
    this.httpClient = new HttpClient({
      baseAddress: 'http://registry.npmjs.org',
    });
  }

  async getVersions(packageId) {
    try {
      const response = await this.httpClient.getJson(`/${packageId}`);
      return Object.values(response.versions).map(version => version.version);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }
}
