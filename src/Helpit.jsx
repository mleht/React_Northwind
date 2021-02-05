import React, { Component } from "react";
import "./App.css";

class Helpit extends Component {
  state = {};
  render() {
    if (this.props.moduli === "NWLoginsFetch") {
      return (
        <div>
          <div>
            <b>Käyttäjien listaus</b>
            <p>
              Tällä sivulla on listattuna sovelluksen käyttäjät. Sivulla on myös
              napit käyttäjän lisäykselle, muokkaukselle ja poistolle.
            </p>
          </div>
          <div>
            <b>Lisää asiakas</b>
            <p>
              Täytä kentät ja paina Tallenna käyttäjä-nappia. Huomaa, että
              username tulee olla yksilöllinen eikä sellainen, joka on jo
              toisella käyttäjällä. Saat Alert-viestinä serverin vastauksen,
              jossa näet onnistuiko lisäys.
            </p>
          </div>
          <div>
            <b>Muokkaa käyttäjän tietoja</b>
            <p>
              Muokkaa-lomakkeella voit muokata käyttäjän tietoja lukuunottamatta
              yksilöllista LoginId-tunnusta. Muokkaa haluamisia tietoja ja paina
              Tallenna muutokset-nappia. Saat Alert-viestinä serverin
              vastauksen, jossa näet onnistuiko tietojen tallennus.
            </p>
          </div>
          <div>
            <b>Poista asiakas</b>
            <p>
              Jos olet varma, että haluat poistaa käyttäjän tietokannasta niin
              paina Vahvista poisto-nappia. Toimintoa ei voi perua. Saat
              Alert-viestinä serverin vastauksen, jossa näet onnistuiko poisto.
            </p>
          </div>
                        
        </div>
      );
    } else if (this.props.moduli === "NWProductsFetch") {
      return (
        <div>
          <div>
            <b>Tuotteet listaus</b>
            <p>
              Tuotteet listaus näyttää kerrallaan maksimissään 10 tuotetta.
              Seuraavat 10-napilla saat näkyviin seuraavat kymmenen tulosta, jos
              tuloksia on lisää. Edelliset 10-napilla saat näkyviin edelliset 10
              tulosta.
            </p>
          </div>
          <div>
            <b>Lisää tuote</b>
            <p>
              Lisää tuote-lomakkeella voit lisätä tuotteen tietokantaan. Täytä
              kentät ja paina Tallenna tuote-nappia. Saat Alert-viestinä
              serverin vastauksen, jossa näet onnistuiko lisäys.
            </p>
          </div>
          <div>
            <b>Muokkaa tuotteen tietoja</b>
            <p>
              Muokkaa-lomakkeella voit muokata asiakkaan tietoja lukuunottamatta
              yksilöllista ProductId-tunnusta. Muokkaa haluamisia tietoja ja
              paina Tallenna muutokset-nappia. Saat Alert-viestinä serverin
              vastauksen, jossa näet onnistuiko tietojen tallennus.
            </p>
          </div>
          <div>
            <b>Poista tuote</b>
            <p>
              Jos olet varma, että haluat poistaa tuotteen tietokannasta niin
              paina Vahvista poisto-nappia. Toimintoa ei voi perua. Saat
              Alert-viestinä serverin vastauksen, jossa näet onnistuiko poisto.
            </p>
          </div>
                        
        </div>
      );
    } else if (this.props.moduli === "NWCustomerFetch") {
      return (
        <div>
          <div>
            <b>Asiakkaat listaus</b>
            <p>
              Jos rajausehtoja ei ole käytössä näyttää asiakkaat listaus
              kerrallaan maksimissään 10 asiakasta. Seuraavat 10-napilla saat
              näkyviin seuraavat kymmenen tulosta, jos tuloksia on lisää.
              Edelliset 10-napilla saat näkyviin edelliset 10 tulosta. Voit myös
              rajata hakua maan mukaan kirjoittamalla maan nimen kenttään. Jos
              kyseisessä maassa on tuloksia tulevat ne kaikki kerralla näkyviin
              sivulle.
            </p>
          </div>
          <div>
            <b>Lisää asiakas</b>
            <p>
              Lisää asiakas-lomakkeella voit lisätä asiakkaan tietokantaan.
              Täytä kentät ja paina Tallenna asiakas-nappia. Huomaa, että
              CustomerID tulee olla yksilöllinen eikä sellainen, joka on jo
              toisen asiakkaan käytössä. Saat Alert-viestinä serverin
              vastauksen, jossa näet onnistuiko lisäys.
            </p>
          </div>
          <div>
            <b>Muokkaa asiakkaan tietoja</b>
            <p>
              Muokkaa-lomakkeella voit muokata asiakkaan tietoja lukuunottamatta
              yksilöllista CustomerID-tunnusta. Muokkaa haluamisia tietoja ja
              paina Tallenna muutokset-nappia. Saat Alert-viestinä serverin
              vastauksen, jossa näet onnistuiko tietojen tallennus.
            </p>
          </div>
          <div>
            <b>Poista asiakas</b>
            <p>
              Jos olet varma, että haluat poistaa asiakkaan tietokannasta niin
              paina Vahvista poisto-nappia. Toimintoa ei voi perua. Saat
              Alert-viestinä serverin vastauksen, jossa näet onnistuiko poisto.
            </p>
          </div>
                        
        </div>
      );
    } else {
      return (
        <div>
          <p>Tälle toiminnolle ei ole ohjetta.</p>                   
        </div>
      );
    }
  }
}
export default Helpit;
