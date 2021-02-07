import React, { Component } from "react";
import "./App.css";
import Helpit from "./Helpit";
import NWCustomerAdd from "./NWCustomerAdd";
import NWCustomerDelete from "./NWCustomerDelete";
import NWCustomerEdit from "./NWCustomerEdit";
import { Redirect } from "react-router-dom";

class NWCustomerFetch2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asiakkaat: [], // asiakkaat niminen olio eli tyhjä taulukko ( ei kaadu kun se alustetaan jo tässä)
      start: 0, // käytetään hakujoukon limitterinä.
      take: 10, // käytetään hakujoukon limitterinä.
      country: "", // käytetään hakujoukon limitterinä jos maa on valittu
      visible: "table", // ehdolliseen returniiin oletusarvo
      renderChildAdd: true, // käytetään  kertomaan pitääkö formi renderöidä vaiko ei
      renderChildEdit: true, // sama kuin yllä
      renderChildDelete: true, // sama kuin yllä
      yksiAsiakas: [], // yksiAsiakas niminen olio eli tyhjä taulukko edit ja poisto-toiminta varten
    };
    this.handleChangeCountry = this.handleChangeCountry.bind(this); // handleChangeCountry pitää bindata constructorissa eli toisinsanoen KUUNTELIJA (handleChangeCountry) SIDOTAAN KOMPONENTTIIN (NWCutomerFetch2) ITSEENSÄ
    this.handleChildUnmountAdd = this.handleChildUnmountAdd.bind(this);
    this.handleChildUnmountEdit = this.handleChildUnmountEdit.bind(this);
    this.handleChildUnmountDelete = this.handleChildUnmountDelete.bind(this);
  }

  handleChildUnmountAdd() {
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
    this.setState({ visible: "table" }); // tätä nappia painaessa visiblen state on table ja ehdollinen render sen mukaan
  };

  handleClickAdd = () => {
    this.setState({ visible: "addform", renderChildAdd: true }); // tätä nappia painaessa visiblen state on addform ja ehdollinen render sen mukaan
  };

  handleClickHelp = () => {
    this.setState({ visible: "help" }); // tätä nappia painaessa visiblen state on help ja ehdollinen render sen mukaan
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
    // (nuolisyntaksi)  - Tämä toteutetaan kun klikataan seuraavat nappia
    let tuloksia = this.state.asiakkaat.length;
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

  handleChangeCountry(event) {
    // ottaa vastaan eventin, Tämä on siis "kuuntelija" kun joku muuttaa tekstikenttää
    // Suorittaa input-kenttään annetun tiedon asetuksen “arvo” –muuttujaan
    // Päivittää staten setState-komennolla
    // Kutsuu “callback” –rutiinina tässä esimerkissä this.HaeNWRestApista-nimistä funktiota
    // Eli tämä tekee staten päivityksen “heti” – muuten se on yhden askeleen jäljessä, koska setState-kutsu ei ole synkroninen
    let arvo = event.target.value;
    this.setState({ country: arvo }, this.HaeNWRestApista);
  }

  handleClickEdit = (elementOlioEditButtonista, event) => {
    this.setState({
      yksiAsiakas: elementOlioEditButtonista, // viedään constructorissa määritettyyn taulukkoon yksiAsiakas klikatun rivin asiakas joka on elementOlioEditButtonista parametrissa
      visible: "editform", // ehdolliseen returniin editform
      renderChildEdit: true, // formin renderöinti true
    });
  };

  handleClickDelete = (poistettava, event) => {
    this.setState({
      yksiAsiakas: poistettava, // viedään constructorissa määritettyyn taulukkoon yksiAsiakas klikatun rivin asiakas joka on elementOlioEditButtonista parametrissa
      visible: "deleteform", // ehdolliseen returniin deleteform, jonka render nyt renderöi
      renderChildDelete: true,
    });
  };

  HaeNWRestApista() {
    let uri = "";
    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan

    if (this.state.country !== "") {
      uri =
        // "https://localhost:5001/nw/customer/r?offset=0" +

        "https://webapitesti.azurewebsites.net/nw/customer/r?offset=0" +
        "&limit=100" +
        "&Country=" +
        this.state.country;
    } else {
      uri =
        // "https://localhost:5001/nw/customer/r?offset="

        "https://webapitesti.azurewebsites.net/nw/customer/r?offset=" +
        this.state.start +
        "&limit=" +
        this.state.take;
    }

    // yllä koostetaan osoite, asp.net core apin mukaiseen metodiin, jossa route r sekä parametrit offset, limit & country

    fetch(uri, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      // fetch komento saa parametriksi urin eli ylempänä asetetun web-osoitteen
      .then((response) => response.json())
      .then((json) => {
        // data joka tulee niin muunneraan JavaScript objektiksi ja tuupataan alempana setStatella asiakkaat-taulukkoon
        this.setState({ asiakkaat: json }); //Viedään tulosjoukko (json) setState-komennolla asiakkaat -olioon
      });
  }

  componentDidMount() {
    this.HaeNWRestApista();
  }

  render() {
    let viesti = "NW Customers-rivejä:" + this.state.asiakkaat.length;
    let taulukko = []; // Javascript taulukko (ei html-taulukko, mutta kehystetään html merkeillä datavaiheessa  <td> ja return vaiheessa <table>)
    let tHeaders = null; // "" aiheuttaa consoleen virheen
    if (this.state.asiakkaat.length > 0) {
      // jos on tullut tulos eli pituus on yli 0
      //Luodaan taulukon otsikot
      tHeaders = (
        <tr>
          <th>CustomerId</th>
          <th>CompanyName</th>
          <th>ContactName</th>
          <th>Country</th>
          <th></th>
          <th></th>
        </tr>
      );
      for (let index = 0; index < this.state.asiakkaat.length; index++) {
        // käydään tulosjoukko läpi for-loopissa
        const element = this.state.asiakkaat[index]; // element muuttuja/olio on aina yksi tulos tulosjoukosta, viedään elementtiin käsillä olevan rivin koko JS-objekti, Index kasvaa joka kierrokella yhdellä.
        taulukko.push(
          // lisätään ko. element taulukkoon pushilla (huom. taulukossa tr key)
          <tr key={element.customerId}>
            <td>{element.customerId}</td>
            <td>{element.companyName}</td>
            <td>{element.contactName}</td>
            <td>{element.country}</td>
            {/* prettier-ignore */}
            <td><button onClick={this.handleClickEdit.bind(this, element)} className="btn btn-primary">Muokkaa</button>{/* Button hyödyntää parametrina samaa element oliota kuin taulukon muodostus*/}</td>
            {/* prettier-ignore */}
            <td><button onClick={this.handleClickDelete.bind(this, element)} className="btn btn-primary">Poista</button></td>
          </tr>
        );
      }
    } else {
      viesti = "Ladataan tietoja Northwind-tietokannasta.";
    }
    // Alla palautetaan vaihtoehtoinen näkymä riippunee visible.statesta (eli mitä nappia on painettu)
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
            <h1>Northwind asiakkaat</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickPrev} title="Asiakkaat listaus näyttää kerralla maksimissään 10 asiakasta. Edelliset 10-napilla saat näkyviin edelliset kymmenen tulosta.">Edelliset 10</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickNext} title="Asiakkaat listaus näyttää kerralla maksimissään 10 asiakasta. Seuraavat 10-napilla saat näkyviin seuraavat kymmenen tulosta.">Seuraavat 10</button>
            <br />
            <br />
            {/* prettier-ignore */}
            <input type="text" placeholder="Rajaa hakua maan nimellä" title="Ohjelma hakee tiedot ja näyttää tulokset yhdellä sivulla antamasi maan mukaisesti" value={this.state.country} onChange={this.handleChangeCountry} size="30"/>
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
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickAdd}>Lisää asiakas</button>
            <br />
            <br />
          </div>
        </div>
      );
    } else if (this.state.visible === "addform") {
      return (
        <div className="container">
          <div>
            <h1>Asiakkaan lisäys</h1>
            <br />
            {this.state.renderChildAdd ? (
              <NWCustomerAdd unmountMe={this.handleChildUnmountAdd} />
            ) : null}
          </div>
          <div>
            <hr />
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickTable}>Asiakkaat listaus</button>
          </div>
        </div>
      );
    } else if (this.state.visible === "editform") {
      return (
        <div className="container">
          <div>
            <h1>Asiakastietojen muokkaus</h1>
            <br />
            {this.state.renderChildEdit ? (
              <NWCustomerEdit
                asiakasObj={this.state.yksiAsiakas}
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
            <button className="btn btn-primary" onClick={this.handleClickTable}>Asiakkaat listaus</button>
          </div>
        </div>
      );
    } else if (this.state.visible === "deleteform") {
      return (
        <div className="container">
          <div>
            <h1>Asiakkaan poistaminen</h1>
            <br />
            {this.state.renderChildDelete ? (
              <NWCustomerDelete
                asiakasObj={this.state.yksiAsiakas}
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
            <button className="btn btn-primary" onClick={this.handleClickTable}>Asiakkaat listaus</button>
          </div>
        </div>
      );
    } else if (this.state.visible === "help") {
      return (
        <div className="container">
          <div>
            <h1>Sovelluksen opasteet - Asiakkaat</h1>
            <br />
            <Helpit moduli="NWCustomerFetch" />
            <hr />
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickAdd}>Lisää asiakas</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickTable}>Asiakkaat listaus</button>
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
export default NWCustomerFetch2;
