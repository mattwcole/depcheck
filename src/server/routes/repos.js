import { Router } from 'express';
import { wrap } from 'async-middleware';
import projectFactory from '../lib/projectFactory';

export default () => {
  const repositories = Router();

  repositories.get('/:owner/:repo/dependencies', wrap(async (req, res) => {
    const { owner, repo } = req.params;
    const project = await projectFactory({
      owner, repo, token: process.env.GITHUB_API_TOKEN,
    });

    const dependencySummary = await project.getRepoDependencySummary(owner, repo);

    res.json(dependencySummary);
  }));

  return repositories;
};
