import React, { Component } from "react";
import "./App.css";
import { Redirect } from "react-router-dom";
import NWLoginsAdd from "./NWLoginsAdd";
import NWLoginsEdit from "./NWLoginsEdit";
import NWLoginsDelete from "./NWLoginsDelete";
import Helpit from "./Helpit";

class NWLoginsFetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [], // users niminen olio eli tyhjä taulukko ( ei kaadu kun se alustetaan jo tässä)
      visible: "table", // ehdolliseen returniiin oletusarvo
      renderChildAdd: true, // käytetään  kertomaan pitääkö formi renderöidä vaiko ei
      renderChildEdit: true, // sama kuin yllä
      renderChildDelete: true, // sama kuin yllä
      oneUser: [], // oneUser niminen olio eli tyhjä taulukko edit toiminta varten
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

  handleClickAdd = () => {
    this.setState({ visible: "addform", renderChildAdd: true }); // tätä nappia painaessa visiblen state on addform
  };

  handleClickTable = () => {
    // https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/
    this.setState({ visible: "table" }); // tätä nappia painaessa visiblen state on table
  };

  handleClickEdit = (elementOlioEditButtonista, event) => {
    this.setState({
      oneUser: elementOlioEditButtonista, // viedään constructorissa määritettyyn taulukkoon oneUSesr klikatun rivin user joka on elementOlioEditButtonista parametrissa
      visible: "editform", // ehdolliseen returniin editform
      renderChildEdit: true, // formin renderöinti true
    });
  };

  handleClickDelete = (poistettava, event) => {
    this.setState({
      oneUser: poistettava, // viedään constructorissa määritettyyn taulukkoon yksiAsiakas klikatun rivin asiakas joka on elementOlioEditButtonista parametrissa
      visible: "deleteform", // ehdolliseen returniin deleteform, jonka render nyt renderöi
      renderChildDelete: true,
    });
  };

  handleClickHelp = () => {
    this.setState({ visible: "help" }); // tätä nappia painaessa visiblen state on help
  };

  HaeNWRestApista() {
    // let uri = "https://localhost:5001/nw/logins";
    let uri = "https://webapitesti.azurewebsites.net/nw/logins";
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
        this.setState({ users: json });
      });
  }

  componentDidMount() {
    this.HaeNWRestApista();
  }

  render() {
    let viesti = "Käyttäjiä: " + this.state.users.length;
    let taulukko = []; // Javascript taulukko (ei html-taulukko, mutta kehystetään html merkeillä datavaiheessa  <td> ja return vaiheessa <table>)
    let tHeaders = null; // "" aiheuttaa consoleen virheen
    if (this.state.users.length > 0) {
      // jos on tullut tulos eli pituus on yli 0
      //Luodaan taulukon otsikot
      tHeaders = (
        <tr>
          <th>LoginId</th>
          <th>Username</th>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Email</th>
          <th>AccessLevelId</th>
          <th></th>
          <th></th>
        </tr>
      );
      for (let index = 0; index < this.state.users.length; index++) {
        // käydään tulosjoukko läpi for-loopissa
        const element = this.state.users[index]; // element muuttuja/olio on aina yksi tulos tulosjoukosta, viedään elementtiin käsillä olevan rivin koko JS-objekti, Index kasvaa joka kierrokella yhdellä.
        taulukko.push(
          // lisätään ko. element taulukkoon pushilla (huom. taulukossa tr key)
          <tr key={element.loginId}>
            <td>{element.loginId}</td>
            <td>{element.userName}</td>
            <td>{element.firstname}</td>
            <td>{element.lastname}</td>
            <td>{element.email}</td>
            <td>{element.accessLevelId}</td>
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
      if (localStorage.getItem("token") === null) {
        // jos ei olla sisäänkirjautuneena ohjataan kirjautumaan
        return <Redirect push to="/tili" />;
      }
      return (
        <div className="container">
          <div>
            <h1>Käyttäjät</h1>
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
            <button className="btn btn-primary" onClick={this.handleClickAdd}>Lisää uusi käyttäjä</button>
            <br />
            <br />
          </div>
        </div>
      );
    } else if (this.state.visible === "addform") {
      return (
        <div className="container">
          <h1>Asiakkaan lisäys</h1>
          <br />
          {this.state.renderChildAdd ? (
            <NWLoginsAdd unmountMe={this.handleChildUnmountAdd} />
          ) : null}
          <hr />
          <h1>Muut toiminnot</h1>
          <br />
          {/* prettier-ignore */}
          <button className="btn btn-primary" onClick={this.handleClickHelp}>Näytä opaste</button>
          {/* prettier-ignore */}
          <button className="btn btn-primary" onClick={this.handleClickTable}>Käyttäjät listaus</button>
          <br />
          <br />
        </div>
      );
    } else if (this.state.visible === "editform") {
      return (
        <div className="container">
          <div>
            <h1>Käyttäjän muokkaus</h1>
            <br />
            {this.state.renderChildEdit ? (
              <NWLoginsEdit
                userObj={this.state.oneUser}
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
            <button className="btn btn-primary" onClick={this.handleClickTable}>Käyttäjät listaus</button>
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
              <NWLoginsDelete
                userObj={this.state.oneUser}
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
            <button className="btn btn-primary" onClick={this.handleClickTable}>Käyttäjät listaus</button>
          </div>
        </div>
      );
    } else if (this.state.visible === "help") {
      return (
        <div className="container">
          <div>
            <h1>Sovelluksen opasteet - Käyttäjät</h1>
            <br />
            <Helpit moduli="NWLoginsFetch" />
            <hr />
            <h1>Muut toiminnot</h1>
            <br />
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickAdd}>Lisää käyttäjä</button>
            {/* prettier-ignore */}
            <button className="btn btn-primary" onClick={this.handleClickTable}>Käyttäjät listaus</button>
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

export default NWLoginsFetch;
