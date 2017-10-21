import fetch from 'node-fetch';

const parseResponse = async (response) => {
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export default class NuGetClient {
  constructor() {
    this.url = 'https://api.nuget.org/v3-flatcontainer';
  }

  async getVersions(packageId) {
    const response = await fetch(`${this.url}/${packageId}/index.json`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const result = await parseResponse(response);
    return result.versions;
  }
}
