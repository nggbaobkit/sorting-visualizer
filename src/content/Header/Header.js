import React, { Component } from "react";
import "./Header.scss";
import LogoPic from "../../img/columns.png";

export class Header extends Component {
  render() {
    return (
      <div className="row header-container align-items-center">
        <div className="col d-flex align-items-center">
          <img className="app-logo" src={LogoPic} alt="logo" />
          <h1 className="header-content">Sorting Visualizer</h1>
        </div>
      </div>
    );
  }
}
