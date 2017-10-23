import Fetch from './http/Fetch';

const baseAddress = process.env.BUILD_TARGET === 'server'
  ? `http://localhost:${process.env.PORT || 3000}` : '';

const fetch = new Fetch({ baseAddress });

export const getRepoDependencies = async (owner, name) =>
  fetch.getJson(`/api/repos/${owner}/${name}/dependencies`);

export default getRepoDependencies;
