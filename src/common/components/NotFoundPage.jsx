import React from 'react';
import Status from './Status';

const NotFoundPage = () => (
  <Status code={404}>
    <h1 className="title">Not Found</h1>
  </Status>
);

export default NotFoundPage;
