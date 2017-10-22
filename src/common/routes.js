import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import RepoPage from './components/RepoPage';

export default [
  {
    key: 1,
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    key: 2,
    path: '/about',
    component: AboutPage,
  },
  {
    key: 3,
    path: '/repos/:owner/:repo',
    component: RepoPage,
    preServerRender: RepoPage.preServerRender,
  },
  {
    key: 4,
    component: NotFoundPage,
  },
];
