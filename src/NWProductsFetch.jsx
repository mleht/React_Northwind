import React, { Component } from "react";
import "./App.css";
import { Redirect } from "react-router-dom";
import NWProductsAdd from "./NWProductsAdd";
import NWProductsEdit from "./NWProductsEdit";
import NWProductsDelete from "./NWProductsDelete";
import Helpit from "./Helpit";

class NWProductsFetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [], // products niminen olio eli tyhjä taulukko ( ei kaadu kun se alustetaan jo tässä)
      visible: "table", // ehdolliseen returniiin oletusarvo
      start: 0, // käytetään hakujoukon limitterinä.
      take: 10, // käytetään hakujoukon limitterinä.
      renderChildAdd: true, // käytetään  kertomaan pitääkö formi renderöidä vaiko ei
      renderChildEdit: true, // sama kuin yllä
      renderChildDelete: true, // sama kuin yllä
      oneProduct: [], // oneProduct niminen olio eli tyhjä taulukko edit toiminta varten
    };
    this.handleChildUnmountAdd = this.handleChildUnmountAdd.bind(this);
    this.handleChildUnmountEdit = this.handleChildUnmountEdit.bind(this);
    this.handleChildUnmountDelete = this.handleChildUnmountDelete.bind(this);
  }

  handleChildUnmountAdd() {
    // Sulkee käyttäjän lisäämislomakkeen, tuo taulukon näkyviin ja tekee haun uudelleen
    this.setState({ renderChildAdd: false });
    this.handleClickTable();
    this.HaeNWRestApista();
  }

  handleChildUnmountEdit() {
    this.setState({ renderChildEdit: false });
    this.handleClickTable();
    this.HaeNWRestApista();
  }

  handleChildUnmountDelete() {
    this.setState({ renderChildDelete: false });
    this.handleClickTable();
    this.HaeNWRestApista();
  }

  handleClickTable = () => {
    // https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/
    this.setState({ visible: "table" }); // tätä nappia painaessa visiblen state on table
  };

  handleClickAdd = () => {
    this.setState({ visible: "addform", renderChildAdd: true }); // tätä nappia painaessa visiblen state on addform
  };

  handleClickEdit = (elementOlioEditButtonista, event) => {
    this.setState({
      oneProduct: elementOlioEditButtonista, // viedään constructorissa määritettyyn taulukkoon oneProduct klikatun rivin product joka on elementOlioEditButtonista parametrissa
      visible: "editform", // ehdolliseen returniin editform
      renderChildEdit: true, // formin renderöinti true
    });
  };

  handleClickDelete = (poistettava, event) => {
    this.setState({
      oneProduct: poistettava, // viedään constructorissa määritettyyn taulukkoon  klikatun rivin tuote joka on elementOlioEditButtonista parametrissa
      visible: "deleteform", // ehdolliseen returniin deleteform, jonka render nyt renderöi
      renderChildDelete: true,
    });
  };

  handleClickHelp = () => {
    this.setState({ visible: "help" }); // tätä nappia painaessa visiblen state on help
  };

  handleClickPrev = (event) => {
    // (nuolisyntaksi)  - Tämä toteutetaan kun klikataan edelliset nappia
    let startvalue = this.state.start; // apumuuttujaan startvalue annetaan this.state.start eli tämänhetkinen arvo
    if (startvalue > 0) {
      startvalue = startvalue - 10;
    }
    this.setState(
      {
        // staten päivitys, uusi start-arvo on apumuuttuja startvalue, jota yllä pienennettiin kymmenellä ja take on 10
        start: startvalue,
        take: 10,
      },
      this.HaeNWRestApista // haetaan restapista sen jälkeen kun setState on “valmistunut”
    );
  };

  handleClickNext = (event) => {
    let tuloksia = this.state.products.length;
    // kun ei enää tuloksia niin next klikkaus ei tee mitään
    if (tuloksia === 10) {
      this.setState(
        {
          // staten päivitys, uusi start-arvo on vanha + 10 ja take on 10
          start: this.state.start + 10,
          take: 10,
        },
        this.HaeNWRestApista // haetaan restapista sen jälkeen kun setState on “valmistunut”
      );
    }
  };

  HaeNWRestApista() {
    // let uri ="https://localhost:5001/nw/products/r?offset=" + this.state.start +"&limit=" + this.state.take;
    let uri =
      "https://webapitesti.azurewebsites.net/nw/products/r?offset=" +
      this.state.start +
      "&limit=" +
      this.state.take;

    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan

    fetch(uri, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ products: json }); // tulos JS-taulukkoon products
      });
  }

  componentDidMount() {
    this.HaeNWRestApista();
  }

  render() {
    let viesti = "Rivejä: " + this.state.products.length;
    let taulukko = []; // Javascript taulukko (ei html-taulukko, mutta kehystetään html merkeillä datavaiheessa  <td> ja return vaiheessa <table>)
    let tHeaders = null; // "" aiheuttaa consoleen virheen
    if (this.state.products.length > 0) {
      // jos on tullut tulos eli pituus on yli 0
      //Luodaan taulukon otsikot
      tHeaders = (
        <tr>
          <th>ProductId</th>
          <th>ProductName</th>
          <th>SupplierID</th>
          <th>CategoryId</th>
          <th>Unitprice</th>
          <th>Discontinued</th>
          <th></th>
          <th></th>
        </tr>
      );
      for (let index = 0; index < this.state.products.length; index++) {
        // käydään tulosjoukko läpi for-loopissa
        const element = this.state.products[index]; // element muuttuja/olio on aina yksi tulos tulosjoukosta, viedään elementtiin käsillä olevan rivin koko JS-objekti, Index kasvaa joka kierrokella yhdellä.
        taulukko.push(
          // lisätään ko. element taulukkoon pushilla (huom. taulukossa tr key)
          <tr key={element.productId}>
            <td>{element.productId}</td>
            <td>{element.productName}</td>
            <td>{element.supplierId}</td>
            <td>{element.categoryId}</td>
            <td>{element.unitPrice}</td>
            <td>
              {element.discontinued ? "True" : "false"}
              {/* näin saadaan boolean näkyviin*/}
            </td>
            {/* prettier-ignore */}
            <td><button className="btn btn-primary" onClick={this.handleClickEdit.bind(this, element)}>Muokkaa</button>{/* Button hyödyntää parametrina samaa element oliota kuin taulukon muodostus*/}</td>
            {/* prettier-ignore */}
            <td><button className="btn btn-primary" onClick={this.handleClickDelete.bind(this, element)}>Poista</button></td>
          </tr>
        );
      }
    } else {
      viesti = "Ladataan tietoja Northwind-tietokannasta.";
    }
    // Alla palautetaan vaihtoehtoinen näkymä riippune visible.statesta (eli mitä nappia on painettu)
    if (this.state.visible === "table") {
      if (
        localStorage.getItem("token") === null ||
        localStorage.getItem("logged") === null
      ) {
        // jos ei olla sisäänkirjautuneena ohjataan kirjautumaan
        return <Redirect push to="/tili" />;
      }
      return (
        <div className="container">
          <div>
            <h1>Tuotteet</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickPrev} title="Asiakkaat listaus näyttää kerralla maksimissään 10 asiakasta. Edelliset 10-napilla saat näkyviin edelliset kymmenen tulosta.">Edelliset 10</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickNext} title="Asiakkaat listaus näyttää kerralla maksimissään 10 asiakasta. Seuraavat 10-napilla saat näkyviin seuraavat kymmenen tulosta.">Seuraavat 10</button>
            <br />
            <br />
            <div className="table-responsive">
              <table className="table-borderless">
                <thead>{tHeaders}</thead>
                <tbody>{taulukko}</tbody>
              </table>
            </div>
            {/* Yllä tuotu JavaScript taulukko HTML-taulukon sisällöksi */}
            <br />
            <p>{viesti}</p>
          </div>
          <div>
            <hr />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickAdd}>Lisää uusi tuote</button>
            <br />
            <br />
          </div>
        </div>
      );
    } else if (this.state.visible === "addform") {
      return (
        <div className="container">
          <h1>Tuotteet lisäys</h1>
          <br />
          {this.state.renderChildAdd ? (
            <NWProductsAdd unmountMe={this.handleChildUnmountAdd} />
          ) : null}
          <hr />
          <h1>Muut toiminnot</h1>
          <br />
          {/* prettier-ignore */}
          <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
          {/* prettier-ignore */}
          <button className="btn btn-primary" onClick={this.handleClickTable}>Tuotteet listaus</button>
          <br />
          <br />
        </div>
      );
    } else if (this.state.visible === "editform") {
      return (
        <div className="container">
          <div>
            <h1>Tuotteen muokkaus</h1>
            <br />
            {this.state.renderChildEdit ? (
              <NWProductsEdit
                tuoteObj={this.state.oneProduct}
                unmountMe={this.handleChildUnmountEdit}
              />
            ) : null}
            {/* Eli jos renderchildEdit on false ei formia näytetä! */}
          </div>
          <div>
            <hr />
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickTable}>Tuotteet listaus</button>
          </div>
        </div>
      );
    } else if (this.state.visible === "deleteform") {
      return (
        <div className="container">
          <div>
            <h1>Tuotteen poistaminen</h1>
            <br />
            {this.state.renderChildDelete ? (
              <NWProductsDelete
                tuoteObj={this.state.oneProduct}
                unmountMe={this.handleChildUnmountDelete}
              />
            ) : null}
            {/* Eli jos renderchildDelete on false ei formia näytetä! */}

            <br />
            <br />
          </div>
          <div>
            <hr />
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickTable}>Tuotteet listaus</button>
          </div>
        </div>
      );
    } else if (this.state.visible === "help") {
      return (
        <div className="container">
          <div>
            <h1>Sovelluksen opasteet - Tuotteet</h1>
            <br />
            <Helpit moduli="NWProductsFetch" />
            <hr />
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickAdd}>Lisää tuote</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickTable}>Tuotteet listaus</button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div>
            <h1>Sovellusvirhe - Lataa sivu uudelleen</h1>
          </div>
        </div>
      );
    }
  }
}

export default NWProductsFetch;
