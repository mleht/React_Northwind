import React, { Component } from "react";
import "./App.css";

class NWProductsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tuoteObj: [],
      productid: "",
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

  // componentDidMount() – ottaa vastaan emolta propsina tulevan dataobjektin "tuoteObj={this.state.yksiTuote}" ja vie sen kentät stateen
  componentDidMount() {
    // boolean string vaihto radiobuttonien takia
    var syöte = this.props.tuoteObj.discontinued;
    if (syöte === false) {
      syöte = "false";
    } else if (syöte === true) {
      syöte = "true";
    } else {
      syöte = "";
    }
    // null aiheuttaa consoleen virheen, siksi || "" -> // (undefined || '') = ''
    this.setState({
      productid: this.props.tuoteObj.productId || "",
      productname: this.props.tuoteObj.productName || "",
      supplierid: this.props.tuoteObj.supplierId || "",
      categoryid: this.props.tuoteObj.categoryId || "",
      unitprice: this.props.tuoteObj.unitPrice || "",
      discontinued: syöte,
    });
  }

  // handleChangeKentänNimi – kullakin datakentällä on oma rutiini, joka vie muutetut tiedot stateen

  handleChangeProductName(e) {
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

  // boolean string vaihto radiobuttonien takia
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

  // handleSubmit – kutsuu tietokantaanvientirutiinia (estää samalla sivun uudelleenlatauksen preventDefault())
  handleSubmit(event) {
    event.preventDefault();
    this.InsertoiKantaan();
  }

  // InsertoiKantaan() – luo state:n arvojen perusteella kantaan vietävän JavaScriptobjektin  JSON  fetch
  InsertoiKantaan() {
    // Luodaan asiakasobjekti, johon haetaan state:sta tiedot
    const tuote = {
      productname: this.state.productname,
      supplierid: this.state.supplierid,
      categoryid: this.state.categoryid,
      unitprice: this.state.unitprice,
      discontinued: this.state.discontinued,
    };
    // send an asynchronous request to the backend
    const tuoteJson = JSON.stringify(tuote); // JS-objekti tuote muutetaan tuoteJson-nimiseksi JSON-objektiksi

    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan

    // let apiUrl = "https://localhost:5001/nw/products/" + this.state.productid; // luodaan apumuuttuja apiUrl, jolle annetaan apikontrollerin route
    let apiUrl =
      "https://webapitesti.azurewebsites.net/nw/products/" +
      this.state.productid;

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: tuoteJson, // PUT-metodin body-osioon sijoitetaan ylempänä luoto tuoteJson
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
  // * Emokomponentin puolella komponentin kutsu on muokattu monimutkaisemmaksi -> {this.state.renderChildEdit ? <NWCustomerEdit unmountMe={this.handleChildUnmountEdit} /> : null}
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
    let viesti = "";
    if (this.state.discontinued === "true") {
      viesti = "old value: discontinued";
    } else if (this.state.discontinued === "false") {
      viesti = "old value: in production";
    } else {
      viesti = "";
    }
    return (
      <div>
        {/* prettier-ignore */}
        <form onSubmit={this.handleSubmit}> {/* kun buttonia painetaan (submit) niin tämä toteuttaa handlesubmitin */}
            <input type="text" value={this.state.productid} title="ProductId" size="30" readOnly/> <label>ProductId</label><br/>
            <input type="text" value={this.state.productname} placeholder="Productname" onChange={this.handleChangeProductName} size="30"/> <label>Productname</label><br /> {/*onChange-eventin koodissa otetaan vastaan kenttään syötetty data ja päivitetään sillä state*/}
            <input type="number" value={this.state.supplierid} min="1" placeholder="SupplierId (Integer)" onChange={this.handleChangeSupplierId} size="30"/> <label>SupplierId</label><br />  
            <input type="number" value={this.state.categoryid} min="1" placeholder="CategoryId (Integer)" onChange={this.handleChangeCategoryID} size="30"/> <label>CategoryId</label><br />
            <input type="number" value={this.state.unitprice} placeholder="Unitprice" onChange={this.handleChangeUnitPrice} size="30" min="0.00" step="0.01"/> <label>Unitprice</label><br />
            <div onChange={this.handleChangeDisc}>
                <input type="radio" value="false" name="discontinued" required/> In production&nbsp;&nbsp;
                <input type="radio" value="true"  name="discontinued"/> Discontinued &nbsp;&nbsp;&nbsp;&nbsp;  {viesti}
             </div> 
            <button type="submit" className="btn btn-primary">Tallenna tuote</button>   
          </form>
        <br />
      </div>
    );
  }
}

export default NWProductsEdit;
