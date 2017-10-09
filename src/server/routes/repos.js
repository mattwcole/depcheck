import { promisify } from 'util';
import { Router } from 'express';
import { wrap } from 'async-middleware';
import GitHubApi from 'github';
import xml2js from 'xml2js';

const parseXmlString = promisify(xml2js.parseString);

export default () => {
  const repositories = Router();
  const github = new GitHubApi();

  repositories.get('/:owner/:repo', wrap(async (req, res) => {
    const { owner, repo } = req.params;

    const searchResponse = await github.search.code({
      q: `repo:${owner}/${repo} extension:csproj`,
    });

    const contentResponse = await Promise.all(searchResponse.data.items.map(file =>
      github.repos.getContent({ owner, repo, path: file.path })));

    const projectFiles = await Promise.all(contentResponse.map(async file => ({
      name: file.data.name,
      content: await parseXmlString(Buffer.from(file.data.content, 'base64').toString()),
    })));

    const summary = projectFiles.map(file => ({
      name: file.name,
      dependencies: file.content.Project.ItemGroup
        .filter(item => Object.keys(item).includes('PackageReference'))
        .reduce((prev, current) => prev.concat(current.PackageReference), [])
        .map(dep => ({
          name: dep.$.Include,
          version: dep.$.Version,
        })),
    }));

    res.json(summary);
  }));

  return repositories;
};
