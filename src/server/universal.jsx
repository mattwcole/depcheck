import { useStaticRendering, Provider } from 'mobx-react';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { wrap } from 'async-middleware';
import serializeJS from 'serialize-javascript';
import App from '../common/components/App';
import createStores from '../common/stores/createStores';
import routes from '../common/routes';

useStaticRendering(true);

const readFile = promisify(fs.readFile);

const initStores = (stores, url) => {
  let preRender = Promise.resolve();

  routes.some((route) => {
    const match = matchPath(url, route);
    if (match && route.component.preRender) {
      preRender = route.component.preRender({ ...stores, match });
    }
    return match;
  });

  return preRender;
};

export default () => wrap(async (req, res) => {
  const indexHtmlPath = path.resolve(__dirname, 'public', 'index.html');
  const indexHtml = await readFile(indexHtmlPath, 'utf8');

  const stores = createStores();
  await initStores(stores, req.url);

  const routerContext = {};
  const appHtml = renderToString(
    <StaticRouter context={routerContext} location={req.url}>
      <Provider {...stores}>
        <App />
      </Provider>
    </StaticRouter>,
  );

  if (routerContext.status) {
    res.status(routerContext.status);
  }

  if (routerContext.url) {
    return res.redirect(routerContext.url);
  }

  const appState = serializeJS(
    Object.entries(stores).reduce((storeState, entry) => {
      // eslint-disable-next-line no-param-reassign
      storeState[entry[0]] = entry[1].toJS();
      return storeState;
    }, {}), {
      isJSON: true,
    });

  return res.send(
    indexHtml
      .replace('{{SSR_APP}}', appHtml)
      .replace('{{SSR_STATE}}', appState),
  );
});
