import React, { Component } from "react";
import "./App.css";

class NWProductsAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productname: "",
      supplierid: "",
      categoryid: "",
      unitprice: "",
      discontinued: "",
    };
    this.handleChangeProductName = this.handleChangeProductName.bind(this);
    this.handleChangeSupplierId = this.handleChangeSupplierId.bind(this);
    this.handleChangeCategoryID = this.handleChangeCategoryID.bind(this);
    this.handleChangeUnitPrice = this.handleChangeUnitPrice.bind(this);
    this.handleChangeDisc = this.handleChangeDisc.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // alla kuuntelijat formin kentille ja napille/form Onsubmitille

  handleChangeProductName(e) {
    // e voi olla event tai mitä tahansa eli on vain parametri tässä
    // Input-kentän data saadaan e.target.value-objektista ja sillä päivitetään state (Basically it retrieves value of whatever input it was called on. You can set a value in your component’s state to it)
    var syöte = e.target.value;
    // The three dots represent the Spread Operator
    this.setState({ ...this.state, productname: syöte });
  }
  handleChangeSupplierId(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, supplierid: syöte });
  }
  handleChangeCategoryID(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, categoryid: syöte });
  }

  handleChangeUnitPrice(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, unitprice: syöte });
  }

  handleChangeDisc(event) {
    var syöte = event.target.value;
    if (syöte === "false") {
      syöte = false;
      this.setState({ ...this.state, discontinued: syöte });
    } else {
      syöte = true;
      this.setState({ ...this.state, discontinued: syöte });
    }
  }

  handleSubmit(event) {
    // kun formin tallenna nappia painetaan niin toteutetaan tämä
    event.preventDefault(); //  preventDefault is called on the event when submitting the form to prevent a browser reload/refresh
    this.InsertoiKantaan();
  }

  // alla varsinainen metodi kantaan siirtämiseksi
  InsertoiKantaan() {
    // Luodaan JS-asiakasobjekti, johon haetaan state:sta tiedot
    const product = {
      productname: this.state.productname,
      supplierid: this.state.supplierid,
      categoryid: this.state.categoryid,
      unitprice: this.state.unitprice,
      discontinued: this.state.discontinued,
    };

    // send an asynchronous request to the backend
    const productJson = JSON.stringify(product); // JS-objekti product  muutetaan productJson-nimiseksi JSON-objektiksi
    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan
    // const apiUrl = "https://localhost:5001/nw/products"; // luodaan apumuuttuja apiUrl, jolle annetaan apikontrollerin route
    const apiUrl = "https://webapitesti.azurewebsites.net/nw/products";
    fetch(apiUrl, {
      // Lähdetään suorittamaan vientiä Fetchillä
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: productJson, // Post-metodin body-osioon sijoitetaan ylempänä luoto productJson
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
            <input type="text" placeholder="Productname" onChange={this.handleChangeProductName} size="30" required/><br /> {/*onChange-eventin koodissa otetaan vastaan kenttään syötetty data ja päivitetään sillä state*/}
            <input type="number" min="1" placeholder="SupplierId (Integer)" onChange={this.handleChangeSupplierId} size="30"/><br />  
            <input type="number" min="1" placeholder="CategoryId (Integer)" onChange={this.handleChangeCategoryID} size="30"/><br />
            <input type="number" placeholder="Unitprice" onChange={this.handleChangeUnitPrice} size="30" min="0.00" step="0.01"/><br />
            <div onChange={this.handleChangeDisc}>
                <input type="radio" value="false" name="discontinued"/> In production&nbsp;&nbsp;
                <input type="radio" value="true" name="discontinued"/> Discontinued
             </div>
            <button type="submit" className="btn btn-primary">Tallenna tuote</button>   
          </form>
        <br />
      </div>
    );
  }
}

export default NWProductsAdd;
