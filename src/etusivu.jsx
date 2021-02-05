import React, { Component } from "react";
import kuva from "./kuva.jpg";

class etusivu extends Component {
  state = {};
  render() {
    return (
      <div className="container">
        <h1>Tervetuloa React Northwind sovellukseen</h1>
        <br />
        <img src={kuva} className="kuva" alt="Kuva" />
      </div>
    );
  }
}

export default etusivu;
