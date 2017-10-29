import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { FormState, FieldState } from 'formstate';

@observer
export default class RepoSearch extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
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

    this.props.onSearch(this.repoOwner.value, this.repoName.value);
  }

  @observable mounted = false;

  repoOwner = new FieldState('')
    .validators(value => !value && 'Repo owner is required');

  repoName = new FieldState('')
    .validators(value => !value && 'Repo name is required');

  searchForm = new FormState({
    owner: this.repoOwner,
    name: this.repoName,
  });

  render() {
    return (
      <form onSubmit={this.onSearchSubmit}>
        <div className="field is-grouped is-grouped-multiline is-grouped-centered is-block-mobile">
          <div className="control">
            <input
              id="ownerInput"
              type="text"
              className="input"
              value={this.repoOwner.value}
              onChange={event => this.repoOwner.onChange(event.target.value)}
              ref={(input) => { this.ownerInput = input; }}
              placeholder="mattwcole"
            />
            <p className="help is-danger">{this.repoOwner.error}</p>
          </div>
          <div className="control is-hidden-mobile">
            <span>/</span>
          </div>
          <div className="control">
            <input
              id="repoInput"
              type="text"
              className="input"
              value={this.repoName.value}
              onChange={event => this.repoName.onChange(event.target.value)}
              placeholder="gelf-extensions-logging"
            />
            <p className="help is-danger">{this.repoName.error}</p>
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
    );
  }
}
