import HttpClient from '../../../common/lib/http/HttpClient';
import HttpError from '../../../common/lib/http/HttpError';

export default class NuGetClient {
  constructor() {
    this.httpClient = new HttpClient({
      baseAddress: 'https://api.nuget.org/v3-flatcontainer',
    });
  }

  async getVersions(packageId) {
    try {
      const response = await this.httpClient.getJson(`/${packageId}/index.json`);
      return response.versions;
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }
}
