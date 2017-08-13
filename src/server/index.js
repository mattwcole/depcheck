import http from 'http';
import app from './app';

const addWebpackMiddleware = (application) => {
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
    application.use(webpackDevMiddleware(webpackCompiler, {
      publicPath: webpackConfig.output.publicPath,
    }));
    application.use(webpackHotMiddleware(webpackCompiler));
  }
};

addWebpackMiddleware(app);
const server = http.createServer(app);
let currentApp = app;

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on port ' + (process.env.PORT || 3000));
});

if (module.hot) {
  module.hot.accept('./app', () => {
    server.removeListener('request', currentApp);
    addWebpackMiddleware(app);
    server.on('request', app);
    currentApp = app;
  });
}
