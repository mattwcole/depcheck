import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import logo from '../../assets/logo.png';

const menuItems = [
  {
    key: 1,
    name: 'Home',
    to: '/',
  },
  {
    key: 2,
    name: 'About',
    to: '/about',
  },
  {
    key: 3,
    name: 'Test Repo',
    to: '/repos/mattwcole/gelf-extensions-logging',
  },
];

@observer
class Navbar extends Component {
  @observable menuActive = false;

  toggleMenu = () => {
    this.menuActive = !this.menuActive;
  }

  hideMenu = () => {
    this.menuActive = false;
  }

  render() {
    return (
      <nav className="navbar" aria-label="main navigation">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img src={logo} alt="depcheck" width="112" height="28" />
          </Link>
          <button
            className={`button navbar-burger${this.menuActive ? ' is-active' : ''}`}
            onClick={this.toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`navbar-menu${this.menuActive ? ' is-active' : ''}`}>
          {menuItems.map(item => (
            <Link key={item.key} className="navbar-item" to={item.to} onClick={this.hideMenu}>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    );
  }
}

export default Navbar;
