import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import routes from '../routes';

const App = () => (
  <div className="container">
    <Navbar />
    <section className="section">
      <Switch>
        {routes.map(route => route.path && <Route key={route.path} {...route} />)}
      </Switch>
    </section>
  </div>
);

export default App;
