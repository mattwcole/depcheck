import HttpClient from '../../../common/lib/http/HttpClient';

export default class NuGetClient {
  constructor() {
    this.fetch = new HttpClient({
      baseAddress: 'https://api.nuget.org/v3-flatcontainer',
    });
  }

  async getVersions(packageId) {
    const response = await this.fetch.getJson(`/${packageId}/index.json`);
    return response.versions;
  }
}
