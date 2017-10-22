import { useStaticRendering, Provider } from 'mobx-react';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { wrap } from 'async-middleware';
import serializeJs from 'serialize-javascript';
import App from '../common/components/App';
import createStores from '../common/stores/createStores';
import routes from '../common/routes';

useStaticRendering(true);

const readFile = promisify(fs.readFile);

export default () => wrap(async (req, res) => {
  const indexHtmlPath = path.resolve(__dirname, 'public', 'index.html');
  const indexHtml = await readFile(indexHtmlPath, 'utf8');

  const stores = createStores();

  let initStores = Promise.resolve();
  routes.some((route) => {
    const match = matchPath(req.url, route);
    if (match && route.preServerRender) {
      initStores = route.preServerRender(stores, match);
    }
    return match;
  });

  await initStores;

  const routerContext = {};
  const appHtml = renderToString(
    <StaticRouter context={routerContext} location={req.url}>
      <Provider {...stores}>
        <App />
      </Provider>
    </StaticRouter>,
  );

  // TODO: Status codes.

  if (routerContext.url) {
    return res.redirect(routerContext.url);
  }

  const state = Object.assign(
    ...Object.entries(stores).map(
      entry => ({ [entry[0]]: entry[1].toJS() }),
    ),
  );

  const stateJson = serializeJs(state, {
    isJSON: true,
  });

  return res.send(indexHtml.replace('{{SSR_APP}}', appHtml).replace('{{SSR_STATE}}', stateJson));
});
