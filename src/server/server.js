import express from 'express';
import path from 'path';
import api from './routes';
import renderApp from './universal';

const app = express();

app.use(express.static(path.resolve(__dirname, 'public'), { index: false }));
app.use('/api', api());
app.use('/', renderApp());

export default app;
