import HttpClient from './http/HttpClient';

const baseAddress = process.env.BUILD_TARGET === 'server'
  ? `http://localhost:${process.env.PORT || 3000}` : '';

const httpClient = new HttpClient({ baseAddress });

export const getRepoDependencies = async (owner, name) =>
  httpClient.getJson(`/api/repos/${owner}/${name}/dependencies`);

export default getRepoDependencies;
