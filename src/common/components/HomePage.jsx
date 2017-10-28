import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { FormState, FieldState } from 'formstate';

@observer
export default class HomePage extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }

  @action
  componentDidMount() {
    this.mounted = true;
    this.ownerInput.focus();
  }

  onSearchSubmit = async (event) => {
    event.preventDefault();

    const validation = await this.searchForm.validate();
    if (validation.hasError) {
      return;
    }

    this.context.router.history.push(`/repos/${this.owner.value}/${this.repo.value}`);
  }

  @observable mounted = false;

  owner = new FieldState('')
    .validators(value => !value && 'Repo owner is required');

  repo = new FieldState('')
    .validators(value => !value && 'Repo name is required');

  searchForm = new FormState({
    owner: this.owner,
    repo: this.repo,
  });

  render() {
    return (
      <div className="container">
        <h1 className="title">Depcheck</h1>
        <p className="subtitle">
          Check your <strong>GitHub</strong> project dependencies
        </p>
        <form onSubmit={this.onSearchSubmit}>
          <div className="field is-grouped is-grouped-multiline is-grouped-centered is-block-mobile">
            <div className="control">
              <input
                id="ownerInput"
                type="text"
                className="input"
                value={this.owner.value}
                onChange={event => this.owner.onChange(event.target.value)}
                ref={(input) => { this.ownerInput = input; }}
                placeholder="mattwcole"
              />
              <p className="help is-danger">{this.owner.error}</p>
            </div>
            <div className="control is-hidden-mobile">
              <span>/</span>
            </div>
            <div className="control">
              <input
                id="repoInput"
                type="text"
                className="input"
                value={this.repo.value}
                onChange={event => this.repo.onChange(event.target.value)}
                placeholder="gelf-extensions-logging"
              />
              <p className="help is-danger">{this.repo.error}</p>
            </div>
            <div className="control">
              <button className="button is-primary is-hidden-mobile" disabled={!this.mounted}>Go</button>
            </div>
          </div>
          <div className="field">
            <div className="control has-text-centered is-hidden-tablet">
              <button className="button is-primary" disabled={!this.mounted}>Go</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
