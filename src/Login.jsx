import React, { Component } from "react";
import "./App.css";
import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: "",
      Password: "",
      ShowLoginForm: true,
      redirect: false,
      kirjautuminen: "",
      LoggedInUser: "",
    };
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMountissa tarkastetaan onko Token voimassa, jos on ei näytetä kirjautumisikkunaa ja loggedinuser "user" localstoragesta
  componentDidMount() {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      this.setState({
        ...this.state,
        ShowLoginForm: false,
        LoggedInUser: userFromLocalStorage,
      });
    }
  }

  // uloskirjautumisessa tyhjennetään localstorage sekä loggedinuser tieto sekä laittaan kirjautumisformi taas näkyville
  logout() {
    localStorage.clear();
    this.setState({ ...this.state, LoggedInUser: "", ShowLoginForm: true });
    this.setState({ redirect: true });
  }

  handleChangeUserName(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, UserName: syöte });
  }
  handleChangePassword(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Password: syöte });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.LuoObjekti();
  }

  LuoObjekti() {
    const tunnukset = {
      username: this.state.UserName,
      password: this.state.Password,
    };

    const tunnuksetJson = JSON.stringify(tunnukset); // muutetaan tunnus salasana pari Jsoniksi

    // let apiUrl = "https://localhost:5001/api/authentication/"
    let apiUrl = "https://webapitesti.azurewebsites.net/api/authentication/";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: tunnuksetJson, // Post metodin bodyssa menee tunnuksen Jsonina
    })
      .then((response) => response.json())
      .then((json) => {
        const success = json;
        if (success.userName === undefined) {
          // alert(success);
          // alert("Kirjautuminen epäonnistui"); // jos ei palaude username on kirjautuminen epäonnistunut
          this.setState({ kirjautuminen: "fail" });
        } else {
          localStorage.setItem("user", success.userName); // asetaan username ja token LocalStorageen
          localStorage.setItem("token", success.token);
          localStorage.setItem("logged", true); // jos kirjautuneena {localstorage.getItem("user") === true}
          this.setState({
            ...this.state,
            LoggedInUser: success.userName, // asetetaan username LoggedinUser
            ShowLoginForm: false, // piilotetaan formi
            kirjautuminen: "",
          });
        }
      });
  }

  render() {
    if (this.state.ShowLoginForm === true) {
      if (this.state.redirect === true) {
        return <Redirect push to="/" />;
      }
      return (
        <div className="container">
          <h1>Kirjaudu sisään:</h1>
          <br />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="UserName"
              onChange={this.handleChangeUserName}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              onChange={this.handleChangePassword}
              required
            />

            <br />

            <button className="btn btn-primary" type="submit">
              Kirjaudu
            </button>
          </form>
          <br />
          {/* prettier-ignore */}
          {this.state.kirjautuminen === "fail" ? (
            <p className="alert alert-danger">
              <strong>Kirjautuminen epäonnistui.</strong>
            </p>
          ) : (
            <p></p>
          )}
        </div>
      );
    } else {
      return (
        <div className="container">
          <div>
            <h1>Kirjautuneena käyttäjätunnus: {this.state.LoggedInUser}</h1>
            <br />
            <p>
              Kirjautuneena voit käyttää asiakkaat, tuotteet ja käyttäjät
              tietojen ylläpitotoimintoja.
              <br />
              <br />
            </p>
            <button className="btn btn-primary" onClick={() => this.logout()}>
              Kirjaudu ulos
            </button>
          </div>
        </div>
      );
    }
  }
}

export default Login;
