import React from 'react';
import PropTypes from 'prop-types';

const DependencyPanel = ({ project }) => (
  <div className="panel">
    <p className="panel-heading">{project.name}</p>
    {project.dependencies.length > 0 &&
      <div className="panel-block">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Package</th>
              <th>Version</th>
              <th>Latest Stable</th>
              <th>Latest Pre</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {project.dependencies.map(dependency => (
              <tr key={dependency.id}>
                <td>{dependency.id}</td>
                <td>{dependency.versions.current}</td>
                <td>{dependency.versions.latestStable || '-'}</td>
                <td>{dependency.versions.latestPre || '-'}</td>
                <td>{dependency.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
  </div>
);

DependencyPanel.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dependencies: PropTypes.array.isRequired,
  }).isRequired,
};

export default DependencyPanel;
