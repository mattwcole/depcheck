import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './HomePage';
import About from './AboutPage';
import NotFound from './NotFoundPage';
import Repo from './RepoPage';

const App = () => (
  <div className="container">
    <Navbar />
    <section className="section">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/repos/:owner/:repo" component={Repo} />
        <Route component={NotFound} />
      </Switch>
    </section>
  </div>
);

export default App;
