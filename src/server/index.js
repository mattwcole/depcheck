import http from 'http';
import app from './server';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});

if (module.hot) {
  let currentApp = app;

  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
