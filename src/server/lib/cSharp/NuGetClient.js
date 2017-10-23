import Fetch from '../../../common/lib/http/Fetch';

export default class NuGetClient {
  constructor() {
    this.fetch = new Fetch({
      baseAddress: 'https://api.nuget.org/v3-flatcontainer',
    });
  }

  async getVersions(packageId) {
    const response = await this.fetch.getJson(`/${packageId}/index.json`);
    return response.versions;
  }
}
