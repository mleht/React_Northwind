import React, { Component } from "react";
import "./App.css";

class NWCustomerAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CustomerID: "",
      CompanyName: "",
      ContactName: "",
      ContactTitle: "",
      Address: "",
      PostalCode: "",
      Phone: "",
      Country: "",
    };
    this.handleChangeCustomerID = this.handleChangeCustomerID.bind(this);
    this.handleChangeCompanyName = this.handleChangeCompanyName.bind(this);
    this.handleChangeContactName = this.handleChangeContactName.bind(this);
    this.handleChangeContactTitle = this.handleChangeContactTitle.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePostalCode = this.handleChangePostalCode.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // alla kuuntelijat formin kentille ja napille/form Onsubmitille

  handleChangeCustomerID(e) {
    // e voi olla event tai mitä tahansa eli on vain parametri tässä
    // Input-kentän data saadaan e.target.value-objektista ja sillä päivitetään state (Basically it retrieves value of whatever input it was called on. You can set a value in your component’s state to it)
    var syöte = e.target.value;
    // The three dots represent the Spread Operator
    this.setState({ ...this.state, CustomerID: syöte.toUpperCase() });
  }
  handleChangeCompanyName(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, CompanyName: syöte });
  }
  handleChangeContactName(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, ContactName: syöte });
  }

  handleChangeContactTitle(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, ContactTitle: syöte });
  }
  handleChangeAddress(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Address: syöte });
  }
  handleChangePostalCode(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, PostalCode: syöte });
  }
  handleChangePhone(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Phone: syöte });
  }

  handleChangeCountry(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Country: syöte });
  }

  handleSubmit(event) {
    // kun formin tallenna nappia painetaan niin toteutetaan tämä
    // alert("Lähetettiin asiakas: " + this.state.CustomerID); // debuggausta varten
    event.preventDefault(); //  preventDefault is called on the event when submitting the form to prevent a browser reload/refresh
    this.InsertoiKantaan();
  }

  // alla varsinainen metodi kantaan siirtämiseksi
  InsertoiKantaan() {
    // Luodaan JS-asiakasobjekti, johon haetaan state:sta tiedot
    const asiakas = {
      CustomerID: this.state.CustomerID,
      CompanyName: this.state.CompanyName,
      ContactName: this.state.ContactName,
      ContactTitle: this.state.ContactTitle,
      Address: this.state.Address,
      PostalCode: this.state.PostalCode,
      Phone: this.state.Phone,
      Country: this.state.Country,
    };

    // send an asynchronous request to the backend
    const asiakasJson = JSON.stringify(asiakas); // JS-objekti asiakas muutetaan asiakasJson-nimiseksi JSON-objektiksi
    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan
    // const apiUrl = "https://localhost:5001/nw/customer"; // luodaan apumuuttuja apiUrl, jolle annetaan apikontrollerin route
    const apiUrl = "https://webapitesti.azurewebsites.net/nw/customer";
    fetch(apiUrl, {
      // Lähdetään suorittamaan vientiä Fetchillä
      method: "POST", // REST-verbi/method POST
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: asiakasJson, // Post-metodin body-osioon sijoitetaan ylempänä luoto asiakasJson
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
  // * sitten tarimsette emoon handleChildUnmount() metodin joka toteutetaan unmountMe yhteydessa
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
          <input type="text" title="Syötä yksilöllinen asiakastunnus (5 merkkiä)" placeholder="CustomerID (5 merkkiä)" onChange={this.handleChangeCustomerID} size="30" maxLength="5" required/><br /> {/*onChange-eventin koodissa otetaan vastaan kenttään syötetty data ja päivitetään sillä state*/}
          <input type="text" placeholder="Yritys" onChange={this.handleChangeCompanyName} size="30"/><br />  
          <input type="text" placeholder="ContactName" onChange={this.handleChangeContactName} size="30"/><br />
          <input type="text" placeholder="ContactTitle" onChange={this.handleChangeContactTitle} size="30"/><br />   
          <input type="text" placeholder="Address" onChange={this.handleChangeAddress} size="30"/><br />
          <input type="text" placeholder="PostalCode" onChange={this.handleChangePostalCode} size="30" maxLength="10"/><br />    
          <input type="text" placeholder="Phone" onChange={this.handleChangePhone} size="30"/><br />
          <input type="text" placeholder="Country" onChange={this.handleChangeCountry} size="30" maxLength="15"/><br />    
          <button type="submit" className="btn btn-primary">Tallenna asiakas</button>   
        </form>
      </div>
    );
  }
}

export default NWCustomerAdd;
