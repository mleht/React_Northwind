import React, { Component } from "react";
import { Switch, Route, Link, HashRouter } from "react-router-dom";
import etusivu from "./etusivu";
import Login from "./Login";
import NotFoundPage from "./NotFoundPage";
import NWCustomerFetch2 from "./NWCustomerFetch2";
import NWLoginsFetch from "./NWLoginsFetch";
import NWProductsFetch from "./NWProductsFetch";
import TypicodeFetchV2 from "./TypicodeFetchV2";

// inkkien pistteet muutoksena
class Navigaatio extends Component {
  render() {
    return (
      <HashRouter basename="/somefolder">
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark color-nav">
            <Link to="/" className="navbar-brand">
              Northwind React Application 2021
            </Link>
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
                  <Link to="/" className="nav-link">
                    Etusivu
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link to="/asiakkaat" className="nav-link">
                    Asiakkaat
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link to="/Logins" className="nav-link">
                    Käyttäjät
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link to="/Products" className="nav-link">
                    Tuotteet
                  </Link>
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
                    <Link to="/TypicodeFetch" className="dropdown-item">
                      TypicodeFetch demo
                    </Link>
                  </div>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <Link to="/tili" className="nav-link">
                    Käyttäjätilin hallinta
                  </Link>
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
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default Navigaatio;
