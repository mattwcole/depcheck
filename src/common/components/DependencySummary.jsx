import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import DependencyPanel from './DependencyPanel';

@observer
class DependencySummary extends Component {
  static propTypes = {
    dependencies: PropTypes.shape({
      owner: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      summary: PropTypes.object.isRequired,
    }).isRequired,
  }

  render() {
    const { dependencies: { owner, name, summary } } = this.props;

    return (
      <div>
        <div className="content">
          <p>Displaying dependencies for repository <strong>{`${owner}/${name}`}</strong>.</p>
        </div>
        {summary.projects.map(project => (
          <DependencyPanel key={project.path} project={project} />
        ))}
      </div>
    );
  }
}

export default DependencySummary;
