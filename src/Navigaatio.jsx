import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import etusivu from "./etusivu";
import Login from "./Login";
import NWCustomerFetch2 from "./NWCustomerFetch2";
import NWLoginsFetch from "./NWLoginsFetch";
import NWProductsFetch from "./NWProductsFetch";
import TypicodeFetchV2 from "./TypicodeFetchV2";

class Navigaatio extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark color-nav">
            <a className="navbar-brand" href="/">
              Northwind React Application 2021
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarColor02"
              aria-controls="navbarColor02"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor02">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/">
                    Etusivu
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/asiakkaat">
                    Asiakkaat
                  </a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/Logins">
                    Käyttäjät
                  </a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/Products">
                    Tuotteet
                  </a>
                </li>
                <li className="nav-item dropdown active">
                  <a
                    className="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                    href="/"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Typicode
                  </a>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/TypicodeFetch">
                      Typicode demo
                    </a>
                  </div>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/tili">
                    Käyttäjätilin hallinta
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <hr />
          <Switch>
            <Route exact path="/" component={etusivu} />
            <Route path="/asiakkaat" component={NWCustomerFetch2} />
            <Route path="/TypicodeFetch" component={TypicodeFetchV2} />
            <Route path="/tili" component={Login} />
            <Route path="/Logins" component={NWLoginsFetch} />
            <Route path="/Products" component={NWProductsFetch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Navigaatio;
