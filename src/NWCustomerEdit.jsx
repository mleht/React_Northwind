import React, { Component } from "react";
import "./App.css";

class NWCustomerEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asiakasObj: [],
      CustomerID: "",
      CompanyName: "",
      ContactName: "",
      ContactTitle: "",
      Address: "",
      PostalCode: "",
      City: "",
      Country: "",
      Phone: "",
      Fax: "",
    };
    this.handleChangeCompanyName = this.handleChangeCompanyName.bind(this);
    this.handleChangeContactName = this.handleChangeContactName.bind(this);
    this.handleChangeContactTitle = this.handleChangeContactTitle.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePostalCode = this.handleChangePostalCode.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleChangePhone = this.handleChangePhone.bind(this);
    this.handleChangeFax = this.handleChangeFax.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() – ottaa vastaan emolta propsina tulevan dataobjektin "asiakasObj={this.state.yksiAsiakas}" ja vie sen kentät stateen
  componentDidMount() {
    // null aiheuttaa consoleen virheen, siksi || "" -> // (undefined || '') = ''
    this.setState({
      CustomerID: this.props.asiakasObj.customerId || "",
      CompanyName: this.props.asiakasObj.companyName || "",
      ContactName: this.props.asiakasObj.contactName || "",
      ContactTitle: this.props.asiakasObj.contactTitle || "",
      Address: this.props.asiakasObj.address || "",
      PostalCode: this.props.asiakasObj.postalCode || "",
      Phone: this.props.asiakasObj.phone || "",
      Fax: this.props.asiakasObj.fax || "",
      City: this.props.asiakasObj.city || "",
      Country: this.props.asiakasObj.country || "",
    });
  }

  // handleChangeKentänNimi – kullakin datakentällä on oma rutiini, joka vie muutetut tiedot stateen

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
  handleChangeCity(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, City: syöte });
  }

  handleChangeCountry(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Country: syöte });
  }
  handleChangePhone(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Phone: syöte });
  }
  handleChangeFax(event) {
    var syöte = event.target.value;
    this.setState({ ...this.state, Fax: syöte });
  }

  // handleSubmit – kutsuu tietokantaanvientirutiinia (estää samalla sivun uudelleenlatauksen preventDefault())
  handleSubmit(event) {
    // alert("Päivitettävä asiakas: " + this.state.CustomerID); // alert infona
    event.preventDefault();
    this.InsertoiKantaan();
  }

  // InsertoiKantaan() – luo state:n arvojen perusteella kantaan vietävän JavaScriptobjektin  JSON  fetch
  InsertoiKantaan() {
    // Luodaan asiakasobjekti, johon haetaan state:sta tiedot
    const asiakas = {
      CompanyName: this.state.CompanyName,
      ContactName: this.state.ContactName,
      ContactTitle: this.state.ContactTitle,
      Address: this.state.Address,
      PostalCode: this.state.PostalCode,
      City: this.state.City,
      Country: this.state.Country,
      Phone: this.state.Phone,
      Fax: this.state.Fax,
    };
    // send an asynchronous request to the backend
    const asiakasJson = JSON.stringify(asiakas); // JS-objekti asiakas muutetaan asiakasJson-nimiseksi JSON-objektiksi

    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan

    // let apiUrl = "https://localhost:5001/nw/customer/" + this.state.CustomerID; // luodaan apumuuttuja apiUrl, jolle annetaan apikontrollerin route
    let apiUrl =
      "https://webapitesti.azurewebsites.net/nw/customer/" +
      this.state.CustomerID;

    fetch(apiUrl, {
      method: "PUT", // REST-verbi/method POST
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: asiakasJson, // PUT-metodin body-osioon sijoitetaan ylempänä luoto asiakasJson
    })
      .then((response) => response.json())
      .then((json) => {
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
  // * Emokomponentin puolella komponentin kutsu on muokattu  -> {this.state.renderChildEdit ? <NWCustomerEdit unmountMe={this.handleChildUnmountEdit} /> : null}
  // * this.state.renderChildEdit ? tarkoittaa: jos renderChild = true tehdään NWCustomerEdit ja muussa tapauksessa ei tehdä
  // * renderChildEdit (jota yllä käytetään) pitää asettaa Emon constructoriin oletuksena näin -> renderChildEdit: true
  // * sitten tarvitaan emoon handleChildUnmountEdit() metodi, joka toteutetaan unmountMe yhteydessa
  // * Metodi sulkee lomakkeen, tuo taulukon näkyviin ja tekee haun uudelleen
  // * Metodi tarvitsee bindauksen emon constructoriin -> this.handleChildUnmountEdit = this.handleChildUnmountEdit.bind(this);
  // * Emokomponentin puolella lisäämme handleClickEdit metodiin -> renderChildEdit: true, jotta seuraavalla kerralla "lisää asiakas"-nappia painaessa formi avautuu uudelleen

  dismiss() {
    this.props.unmountMe();
  }

  // render() – luo input-kentistä koostuvan HTML-formin ja näyttää propsina stateen saadun datan kentissä
  render() {
    return (
      <div>
        {/* prettier-ignore */}
        <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.CustomerID} title="Asiakastunnus" size="30" readOnly/><br/>
                <input type="text" value={this.state.CompanyName} placeholder="CompanyName" title="CompanyName" onChange={this.handleChangeCompanyName} size="30" required /><br /> 
                <input type="text" value={this.state.ContactName} placeholder="ContactName" title="ContactName" onChange={this.handleChangeContactName} size="30" /><br />
                <input type="text" value={this.state.ContactTitle} placeholder="ContactTitle" title="ContactTitle" onChange={this.handleChangeContactTitle} size="30" /><br />
                <input type="text" value={this.state.Address} placeholder="Address" title="Address" onChange={this.handleChangeAddress} size="30"/><br />
                <input type="text" value={this.state.PostalCode} placeholder="PostalCode" title="PostalCode" onChange={this.handleChangePostalCode} size="30" maxLength="10"/><br />
                <input type="text" value={this.state.City} placeholder="City" title="City" onChange={this.handleChangeCity} size="30"/><br />
                <input type="text" value={this.state.Country} placeholder="Country" title="Country" onChange={this.handleChangeCountry} size="30" maxLength="15"/><br />
                <input type="text" value={this.state.Phone} placeholder="Phone" title="Phone" onChange={this.handleChangePhone} size="30"/><br />
                <input type="text" value={this.state.Fax} placeholder="Fax" title="Fax" onChange={this.handleChangeFax} size="30"/><br />
                <button type="submit" className="btn btn-primary">Tallenna muutokset</button>
            </form>
      </div>
    );
  }
}

export default NWCustomerEdit;
