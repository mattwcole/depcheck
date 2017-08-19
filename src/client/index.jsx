import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

// eslint-disable-next-line react/no-render-return-value
const render = Component => ReactDOM.render(
  <BrowserRouter>
    <AppContainer>
      <Component />
    </AppContainer>
  </BrowserRouter>,
  document.getElementById('app'),
);

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App);
  });
}
