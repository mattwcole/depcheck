import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import createStores from '../common/stores/createStores';
import App from '../common/components/App';
import '../assets/styles.scss';

// eslint-disable-next-line no-underscore-dangle
const stores = createStores(window.__INITIAL_STATE__);

// TODO: Push unhandled promise rejections and window errors to error store using global handlers?

const hydrate = Component => ReactDOM.hydrate(
  <BrowserRouter>
    <AppContainer>
      <Provider {...stores}>
        <Component />
      </Provider>
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
