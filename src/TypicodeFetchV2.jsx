import React, { Component } from "react";
import "./App.css";

// tässä versiossa typicodetechiä kokeillaan paginate ominaisuutta ja maarajausta sekä korjataan ensimmäisen version viive-bugi

class TypicodeFetchV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [], // todos niminen olio eli tyhjä taulukko (kun renderissä viitataan todokseen niin ei kaadu kun se alustetaan jo tässä)
      recordcount: 0, // tätä tullaan käyttämään lukumäärä (length) muuttujana
      start: 0, // käytetään hakujoukon limitterinä. kts. hae typicodesta kohta let uri
      end: 10, // käytetään hakujoukon limitterinä. kts. hae typicodesta kohta let uri
      page: 1, // pagination hakujoukon limitterinä. kts. hae typicodesta kohta uri
      limit: 10, // hakujoukon limitterinä. kts. hae typicodesta kohta uri
      userId: "", // Käytetään userid limitterinä jos formiin on se laitettu. kts. handleChangeUserId
    };
    this.handleChangeUserId = this.handleChangeUserId.bind(this); // handleChangeUserId pitää bindata constructorissa eli toisinsanoein KUUNTELIJA (handleChangeUserId) SIDOTAAN KOMPONENTTIIN (Typicodefetch2) ITSEENSÄ
  }

  componentDidMount() {
    this.HaeTypicodesta();
  }

  handleClickPrev = (event) => {
    // (nuolisyntaksi)  - Tämä toteutetaan kun klikataan edelliset nappia
    let pagenumber = this.state.page; // apumuuttujaan pagenumber annetaan this.state.page eli propsin page tämänhetkinen arvo
    if (pagenumber > 1) {
      // jos se on suurempi kuin yksi niin sitä voi pienentää
      pagenumber = pagenumber - 1; // pienennetään yhdellä sivulla
    }
    this.setState(
      {
        // staten päivitys, uusi page-arvo on apumuuttuja pagenumber arvo, jota yllä pienennettin yhdellä
        page: pagenumber,
      },
      this.handleSubmit // callback-rutiinia kutsutaan, sen jälkeen kun setState on “valmistunut” & handleSubmit “ainoastaan” kutsuu tietojenhakurutiinia sitten, kun setState on tehty
    );
  };

  handleClickNext = (event) => {
    let sivuja = this.state.todos.length;
    if (sivuja > 0) {
      // kun ei enää tuloksia niin next klikkaus ei tee mitään
      this.setState(
        {
          page: this.state.page + 1,
        },
        this.handleSubmit
      );
    }
  };

  handleChangeUserId(event) {
    // ottaa vastaan eventin, Tämä on siis "kuuntelija" kun joku muuttaa tekstikenttää
    // Suorittaa input-kenttään annetun tiedon asetuksen “arvo” –muuttujaan
    // Päivittää staten setState-komennolla
    // Kutsuu “callback” –rutiinina tässä esimerkissä this.handleSubmit-nimistä funktiota
    // Tämä tekee staten päivityksen “heti” – muuten se on yhden askeleen jäljessä, koska setState-kutsu ei ole synkroninen
    let arvo = event.target.value;
    this.setState({ userId: arvo, page: 1 }, this.handleSubmit);
  }

  handleSubmit() {
    this.HaeTypicodesta();
  }

  HaeTypicodesta() {
    let uri = "";

    if (this.state.userId !== "") {
      // jos userID on jotakin muuta kuin tyhjä (eli käyttäjä on laittanut kenttään jotakin)
      uri =
        "https://jsonplaceholder.typicode.com/todos?userId=" + // ? kertoo että annetaan parametreja userId = this.state.userId jne.
        this.state.userId +
        "&_page=" + //  page parametri = props page
        this.state.page +
        "&_limit=" + // limit parametri on props limit
        this.state.limit;
    } else {
      uri =
        "https://jsonplaceholder.typicode.com/todos?_page=" + // ? kertoo että annetaan parametreja, page parametri = props page
        this.state.page +
        "&_limit=" + // limit parametri on props limit
        this.state.limit;
    }

    // let uri = "https://jsonplaceholder.typicode.com/todos";

    fetch(uri) // fetch komento saa parametriksi urin eli ylempänä asetetun web-osoitteen
      .then((Response) => Response.json())
      .then((json) => {
        // data joka tulee niin muunneraan JavaScript objektiksi ja tuupataan alempana setStatella todos taulukkoon
        this.setState({ todos: json, recordcount: json.length }); // Viedään tulosjoukko (json) setState-komennolla todos-olioon (taulukkoon), recordcount kertoo paljonko tuloksia
      });
  }

  render() {
    let viesti = "Rivejä " + this.state.recordcount;
    let tHeaders = null;

    let taulukko = []; // Javascript taulukko (ei html-taulukko, mutta kehystetään html merkeillä datavaiheessa  <td> ja return vaiheessa <table>)
    if (this.state.todos.length > 0) {
      // jos on tullut tulos eli pituus on yli 0
      tHeaders = (
        <tr>
          <th>ID</th>
          <th>UserID</th>
          <th>Title</th>
          <th>Completed</th>
          <th></th>
        </tr>
      );
      for (let index = 0; index < this.state.todos.length; index++) {
        // käydään tulosjoukko läpi for-loopissa
        const element = this.state.todos[index]; // element muuttuja/olio on aina yksi tulos tulosjoukosta, viedään elementtiin käsillä olevan rivin koko JS-objekti, Index kasvaa joka kierrokella yhdellä.
        taulukko.push(
          // lisätään ko. element taulukkoon pushilla (huom. taulukossa tr key)
          <tr key={element.id}>
            <td>{element.id}</td>
            <td>{element.userId}</td>
            <td>{element.title}</td>
            <td>
              {element.completed ? "True" : "false"}
              {/* näin saadaan boolean näkyviin*/}
            </td>
          </tr>
        );
      }
    } else {
      viesti = "Ei tuloksia";
    }

    return (
      <div className="container">
        <div>
          <h1>Haku typicodesta</h1>
          <p>https://jsonplaceholder.typicode.com/todos</p>
          <p>{viesti}</p>
          {/* prettier-ignore */}
          <input type="text" placeholder="Anna UserId" title="Ohjelma hakee tiedot antamallasi käyttäjäkoodilla" value={this.state.userId} onChange={this.handleChangeUserId}/>
          <br />
          <br />
          {/* prettier-ignore */}
          <button className="btn btn-primary" onClick={this.handleClickPrev}>Edelliset</button>
          {/* prettier-ignore */}
          <button className="btn btn-primary" onClick={this.handleClickNext}>Seuraavat</button>
          <br />
          <br />
          <table className="table-borderless">
            <thead>{tHeaders}</thead>
            <tbody>{taulukko}</tbody>
          </table>
          {/* Yllä tuotu JavaScript taulukko HTML-taulukon sisällöksi */}
        </div>
      </div>
    );
  }
}

export default TypicodeFetchV2;
