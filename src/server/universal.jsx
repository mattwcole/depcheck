import { useStaticRendering } from 'mobx-react';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { wrap } from 'async-middleware';
import App from '../common/components/App';

useStaticRendering(true);

const readFile = promisify(fs.readFile);

export default () => wrap(async (req, res) => {
  const indexHtmlPath = path.resolve(__dirname, 'public', 'index.html');
  const indexHtml = await readFile(indexHtmlPath, 'utf8');

  const routerContext = {};
  const appHtml = renderToString(
    <StaticRouter context={routerContext} location={req.url}>
      <App />
    </StaticRouter>,
  );

  return routerContext.url
    ? res.redirect(routerContext.url)
    : res.send(indexHtml.replace('{{SSR}}', appHtml));
});
