import React, { Component } from 'react';
import './Header.scss';
import LogoPic from '../../img/columns.png';

export class Header extends Component {
  render() {
    return (
      <div class='row header-container align-items-center'>
        <div class='col d-flex align-items-center'>
          <img class='app-logo' src={LogoPic} alt='logo' />
          <h1 class='header-content'>Sorting Visualizer</h1>
        </div>
      </div>
    );
  }
}
