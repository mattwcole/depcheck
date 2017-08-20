import express from 'express';
import path from 'path';
import renderApp from './universal';

const app = express();

app.use(express.static(path.resolve(__dirname, 'public'), { index: false }));

app.get('/api', (req, res) => {
  res.send({
    message: 'I am a hot reloadable API response!!',
  });
});

app.use('/', renderApp);

export default app;
