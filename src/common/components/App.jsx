import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './Navbar';
import Footer from './Footer';
import routes from '../routes';

const App = () => (
  <ErrorBoundary>
    <Navbar />
    <section className="section">
      <Switch>
        {routes.map(route => <Route key={route.path || 404} {...route} />)}
      </Switch>
    </section>
    <Footer />
  </ErrorBoundary>
);

export default App;
