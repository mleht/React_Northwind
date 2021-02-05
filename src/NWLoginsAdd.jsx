import React, { Component } from "react";
import "./App.css";

class NWLoginsAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      accesslevel: "",
      password: "",
      password2: "",
      passwords: "",
    };
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeAccessLevel = this.handleChangeAccessLevel.bind(this);
    this.handleChangePassWord = this.handleChangePassWord.bind(this);
    this.handleChangePassWord2 = this.handleChangePassWord2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // alla kuuntelijat formin kentille ja napille/form Onsubmitille

  handleChangeUserName(e) {
    // e voi olla event tai mitä tahansa eli on vain parametri tässä
    // Input-kentän data saadaan e.target.value-objektista ja sillä päivitetään state (Basically it retrieves value of whatever input it was called on. You can set a value in your component’s state to it)
    var syöte = e.target.value;
    // The three dots represent the Spread Operator
    this.setState({ ...this.state, username: syöte });
  }
  handleChangeFirstName(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, firstname: syöte });
  }
  handleChangeLastName(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, lastname: syöte });
  }

  handleChangeEmail(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, email: syöte });
  }
  handleChangeAccessLevel(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, accesslevel: syöte });
  }
  handleChangePassWord(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, password: syöte });
  }
  handleChangePassWord2(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, password2: syöte });
  }

  handleSubmit(event) {
    // kun formin tallenna nappia painetaan niin toteutetaan tämä
    event.preventDefault(); //  preventDefault is called on the event when submitting the form to prevent a browser reload/refresh
    // salasanatarkistus
    if (this.state.password === this.state.password2) {
      this.InsertoiKantaan();
    } else {
      this.setState({ passwords: "fail" });
    }
  }

  // alla varsinainen metodi kantaan siirtämiseksi
  InsertoiKantaan() {
    // Luodaan JS-useronjekti, johon haetaan state:sta tiedot
    const user = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      accesslevelId: this.state.accesslevel,
    };
    // send an asynchronous request to the backend
    const userJson = JSON.stringify(user); // JS-objekti user muutetaan userJson-nimiseksi JSON-objektiksi
    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan
    // const apiUrl = "https://localhost:5001/nw/logins"; // luodaan apumuuttuja apiUrl, jolle annetaan apikontrollerin route
    const apiUrl = "https://webapitesti.azurewebsites.net/nw/logins";
    fetch(apiUrl, {
      // Lähdetään suorittamaan vientiä Fetchillä
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userJson, // Post-metodin body-osioon sijoitetaan ylempänä luoto userJson
    })
      .then((response) => response.json())
      .then((json) => {
        // store the data returned from the backend to the current state
        const success = json;
        if (success) {
          alert(`Response from server: ${success}.`);
          this.dismiss(); // Onnistuneen kantapäivityksen jälkeen syöttölomake pyytää emokomponenttia sulkemaan itsensä
        }
      });
  }

  // * Onnistuneen kantapäivityksen jälkeen syöttölomake pyytää emokomponenttia sulkemaan itsensä "this.dismiss()"
  // * Tuo kutsuu metodia dismiss (alla)
  // * loput sulkemisesta tapahtuu Emokomponentin NWCustomerFetch2 puolella
  // * Emokomponentin puolella komponentin kutsu on muokattu monimutkaisemmaksi -> {this.state.renderChildAdd ? <NWCustomerAdd unmountMe={this.handleChildUnmount} /> : null}
  // * this.state.renderChildAdd ? tarkoittaa: jos renderChild = true tehdään NWCustomerADD ja muussa tapauksessa ei tehdä
  // * renderChildAdd (jota yllä käytetään) pitää asettaa Emon constructoriin oletuksena näin -> renderChildAdd: true
  // * sitten emoon handleChildUnmount() metodi, joka toteutetaan unmountMe yhteydessa
  // * Metodi sulkee lomakkeen, tuo taulukon näkyviin ja tekee haun uudelleen
  // * Metodi tarvitsee bindauksen emon constructoriin -> this.handleChildUnmount = this.handleChildUnmount.bind(this);
  // * Emokomponentin puolella lisäämme handleClickAdd metodiin -> renderChildAdd: true, jotta seuraavalla kerralla "lisää asiakas"-nappia painaessa formi avautuu uudelleen

  dismiss() {
    this.props.unmountMe();
  }

  render() {
    return (
      <div>
        {/* prettier-ignore */}
        <form onSubmit={this.handleSubmit}> {/* kun buttonia painetaan (submit) niin tämä toteuttaa handlesubmitin */}
          <input type="text" placeholder="Username" onChange={this.handleChangeUserName} size="30" required/><br /> {/*onChange-eventin koodissa otetaan vastaan kenttään syötetty data ja päivitetään sillä state*/}
          <input type="text" placeholder="Firstname" onChange={this.handleChangeFirstName} size="30"/><br />  
          <input type="text" placeholder="Lastname" onChange={this.handleChangeLastName} size="30"/><br />
          <select className="gray" name="AccessLevelID" onChange={this.handleChangeAccessLevel} required>
            <option className="gray" value="">AccessLevelID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
            <option className="black" value="1">1</option>
            <option className="black" value="2">2</option>
            <option className="black" value="3">3</option>
            <option className="black" value="4">4</option>
            <option className="black" value="5">5</option>
          </select><br />
          <input type="email" placeholder="Email" onChange={this.handleChangeEmail} size="30"/><br />
          <input type="password" placeholder="Password (min. 6 chars)" onChange={this.handleChangePassWord} size="30" minLength="6" required/><br />    
          <input type="password" placeholder="Confirm password" onChange={this.handleChangePassWord2} size="30" minLength="6" required/><br />  
          <button type="submit" className="btn btn-primary">Tallenna käyttäjä</button>   
        </form>
        <br />
        {this.state.passwords === "fail" ? (
          <p className="alert alert-danger">
            <strong>Salasanat eivät täsmää. Yritä uudelleen.</strong>
          </p>
        ) : (
          <p></p>
        )}
      </div>
    );
  }
}

export default NWLoginsAdd;
