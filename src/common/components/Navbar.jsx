import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import logo from '../../assets/logo.png';

const menuItems = [
  {
    name: 'Home',
    to: '/',
  },
  {
    name: 'About',
    to: '/about',
  },
  {
    name: 'Test Repo',
    to: '/repos/mattwcole/gelf-extensions-logging',
  },
];

@observer
class Navbar extends Component {
  @action
  componentDidMount() {
    this.mounted = true;
  }

  @observable mounted = false;
  @observable menuActive = false;

  @action
  toggleMenu = () => {
    this.menuActive = !this.menuActive;
  }

  @action
  hideMenu = () => {
    this.menuActive = false;
  }

  render() {
    return (
      <header className="container">
        <nav className="navbar" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/">
              <img src={logo} alt="depcheck" width="112" height="28" />
            </Link>
            <button
              className={`button navbar-burger${this.menuActive ? ' is-active' : ''}`}
              onClick={this.toggleMenu}
              disabled={!this.mounted}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
          <div className={`navbar-menu${this.menuActive ? ' is-active' : ''}`}>
            {menuItems.map(item => (
              <Link key={item.name} className="navbar-item" to={item.to} onClick={this.hideMenu}>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    );
  }
}

export default Navbar;
