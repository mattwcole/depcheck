import npmVersionCalculator from 'semver';
import nuGetVersionCalculator from './cSharp/nuGetVersionCalculator';
import * as languages from './languages';
import GitHubClient from './gitHub/GitHubClient';
import GitHubClientCache from './gitHub/GitHubClientCache';
import CSharpProject from './cSharp/CSharpProject';
import NuGetClient from './cSharp/NuGetClient';
import NuGetClientCache from './cSharp/NuGetClientCache';
import JavascriptProject from './javascript/JavascriptProject';
import NpmClient from './javascript/NpmClient';
import NpmClientCache from './javascript/NpmClientCache';
import VersionUtils from './VersionUtils';
import NuGetVersionUtils from './cSharp/NuGetVersionUtils';
import DevCache from './cache/DevCache';
import RedisCache from './cache/RedisCache';

const cache = process.env.CACHE === 'redis'
  ? new RedisCache({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
  : new DevCache();

export default async ({ owner, repo, token }) => {
  const gitHubClient = new GitHubClientCache(new GitHubClient(token), cache);

  const language = await gitHubClient.getLanguage(owner, repo);

  switch (language) {
    case languages.C_SHARP:
      return new CSharpProject(
        gitHubClient,
        new NuGetClientCache(new NuGetClient(), cache),
        new NuGetVersionUtils(nuGetVersionCalculator));
    case languages.JAVASCRIPT:
      return new JavascriptProject(
        gitHubClient,
        new NpmClientCache(new NpmClient(), cache),
        new VersionUtils(npmVersionCalculator));
    default:
      throw new Error(`Unsupported language ${language}`);
  }
};
