import fs from 'fs';
import util from 'util';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../common/components/App';

const readFile = util.promisify(fs.readFile);

export default async (req, res) => {
  let indexHtml;

  try {
    const indexHtmlPath = path.resolve(__dirname, 'public', 'index.html');
    indexHtml = await readFile(indexHtmlPath, 'utf8');
  } catch (err) {
    return res.status(404).end();
  }

  const routerContext = {};
  const appHtml = renderToString(
    <StaticRouter context={routerContext} location={req.url}>
      <App />
    </StaticRouter>,
  );

  return routerContext.url
    ? res.redirect(routerContext.url)
    : res.send(indexHtml.replace('{{SSR}}', appHtml));
};
