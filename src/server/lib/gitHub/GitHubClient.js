import fetch from 'node-fetch';

const parseResponse = async (response) => {
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export default class GitHubClient {
  constructor(token) {
    this.token = token;
    this.uri = 'https://api.github.com';
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  async getLanguage(owner, repo) {
    const query = `query {
      repository(owner:"${owner}", name:"${repo}") {
        languages(first: 1, orderBy: {field: SIZE, direction: DESC}) {
          nodes {
            name
          }
        }
      }
    }`;

    const result = await this.sendQuery(query);
    return result.data.repository.languages.nodes[0].name;
  }

  async getFiles(owner, repo, extension) {
    // There is currently no way to search for files using the GraphQL API.
    const query = `repo:${owner}/${repo} filename:${extension}`;
    const response = await fetch(`${this.uri}/search/code?q=${query}`, {
      method: 'GET',
      headers: this.headers,
    });

    const result = await parseResponse(response);
    return result.items;
  }

  async getFilesContent(owner, repo, extension) {
    const files = await this.getFiles(owner, repo, extension);

    const innerQuery = files.reduce((query, file, i) =>
      `${query}
      file${i}: object(expression: "${/ref=(\w+)/.exec(file.url)[1]}:${file.path}") {
        ... on Blob {
          text
        }
      }`, '');
    const query = `query {
      repository(name: "${repo}", owner: "${owner}") {
        ${innerQuery}
      }
    }`;
    const result = await this.sendQuery(query);

    return Object.values(result.data.repository).map((file, i) => ({
      name: files[i].name,
      path: files[i].path,
      content: file.text,
    }));
  }

  async sendQuery(query) {
    const response = await fetch(`${this.uri}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: this.headers,
    });

    return parseResponse(response);
  }
}
