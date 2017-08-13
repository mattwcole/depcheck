import http from 'http';
import app from './app';

let devMiddleware = null;

if (process.env.NODE_ENV === 'development') {
  /* eslint-disable global-require */
  /* eslint-disable import/no-extraneous-dependencies */
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack/client/webpack.config.dev.babel').default;
  /* eslint-enable global-require */
  /* eslint-enable import/no-extraneous-dependencies */

  const webpackCompiler = webpack(webpackConfig);
  devMiddleware = [
    webpackDevMiddleware(webpackCompiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: true,
    }),
    webpackHotMiddleware(webpackCompiler),
  ];
  app.use(devMiddleware);
}

const server = http.createServer(app);
let currentApp = app;

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});

if (module.hot) {
  module.hot.accept('./app', () => {
    server.removeListener('request', currentApp);

    if (devMiddleware) {
      app.use(devMiddleware);
    }

    server.on('request', app);
    currentApp = app;
  });
}
