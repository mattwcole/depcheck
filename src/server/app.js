import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/api', (req, res) => {
  res.send({
    message: 'I am a hot reloadable API response. Change me and reload the page!',
  });
});

export default app;
