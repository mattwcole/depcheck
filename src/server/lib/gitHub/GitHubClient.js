import HttpClient from '../../../common/lib/http/HttpClient';
import GitHubError from './GitHubError';

export default class GitHubClient {
  constructor(token) {
    this.token = token;
    this.httpClient = new HttpClient({
      baseAddress: 'https://api.github.com',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
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

    const response = await this.sendQuery(query);

    if (response.errors) {
      throw new GitHubError('GitHub API query failed.', response.errors);
    }

    return response.data.repository.languages.nodes[0].name;
  }

  async getFiles(owner, repo, extension) {
    // There is currently no way to search for files using the GraphQL API.
    const query = `repo:${owner}/${repo} filename:${extension}`;
    const response = await this.httpClient.getJson(`/search/code?q=${query}`);
    return response.items;
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
    const response = await this.sendQuery(query);

    return Object.values(response.data.repository).map((file, i) => ({
      name: files[i].name,
      path: files[i].path,
      content: file.text,
    }));
  }

  async sendQuery(query) {
    const response = await this.httpClient.postJson('/graphql', { query });

    if (response.errors) {
      throw new GitHubError('GitHub GraphQL API query failed.', response.errors);
    }

    return response;
  }
}
