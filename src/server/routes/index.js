import { Router } from 'express';
import repos from './repos';
import { version } from '../../../package.json';

export default () => {
  const api = Router();

  api.get('/', (req, res) => {
    res.json({ version });
  });

  api.use('/repos', repos());

  api.all('*', (req, res) => res.status(404).json({
    message: 'Resource not found.',
  }));

  return api;
};
