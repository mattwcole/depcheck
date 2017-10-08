import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import App from '../common/components/App';
import '../assets/styles.sass';

const hydrate = Component => ReactDOM.hydrate(
  <BrowserRouter>
    <AppContainer>
      <Component />
    </AppContainer>
  </BrowserRouter>,
  document.getElementById('app'),
);

hydrate(App);

if (module.hot) {
  module.hot.accept('../common/components/App', () => {
    hydrate(App);
  });
}
