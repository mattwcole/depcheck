import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import NotFoundPage from './components/NotFoundPage';
import DependenciesPage from './components/DependenciesPage';

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
    path: '/repos/:owner/:name',
    component: DependenciesPage,
  },
  {
    component: NotFoundPage,
  },
];
