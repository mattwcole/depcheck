import { Router } from 'express';
import errorHandler from '../middleware/errorHandler';
import repos from './repos';
import { version } from '../../../package.json';

export default () => {
  const api = Router();

  api.use('/repos', repos());
  api.use(errorHandler());

  api.get('/', (req, res) => {
    res.json({ version });
  });

  api.all('*', (req, res) => res.status(404).json({
    message: 'Resource not found.',
  }));

  return api;
};
