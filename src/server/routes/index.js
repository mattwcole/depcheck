import { Router } from 'express';
import repos from './repos';
import { version } from '../../../package.json';

export default () => {
  const api = Router();

  api.use('/repos', repos());

  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
