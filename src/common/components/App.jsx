import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import routes from '../routes';

const App = () => (
  <div>
    <Navbar />
    <section className="section">
      <Switch>
        {routes.map(route => <Route key={route.path || 404} {...route} />)}
      </Switch>
    </section>
    <Footer />
  </div>
);

export default App;
