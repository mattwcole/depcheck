import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import RepoPage from './components/RepoPage';

export default [
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/about',
    component: AboutPage,
  },
  {
    path: '/repos/:owner/:repo',
    component: RepoPage,
  },
  {
    component: NotFoundPage,
  },
];
