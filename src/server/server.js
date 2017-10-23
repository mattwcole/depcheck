import express from 'express';
import path from 'path';
import compression from 'compression';
import api from './routes';
import renderApp from './universal';

const app = express();

if (process.env.GZIP === 'true') {
  app.use(compression());
}

app.use(express.static(path.resolve(__dirname, 'public'), { index: false }));
app.use('/api', api());
app.use('/', renderApp());

export default app;
