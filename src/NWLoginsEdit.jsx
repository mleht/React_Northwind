import React, { Component } from "react";
import "./App.css";

class NWLoginsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      loginid: "",
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      accesslevel: "",
      password: "",
      password2: "",
      passwords: "",
    };
    // tähän bindaukset
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeAccess = this.handleChangeAccess.bind(this);
    this.handleChangePassWord = this.handleChangePassWord.bind(this);
    this.handleChangePassWord2 = this.handleChangePassWord2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() – ottaa vastaan emolta propsina tulevan dataobjektin "userObj={this.state.yksiUser}" ja vie sen kentät stateen
  componentDidMount() {
    // null aiheuttaa consoleen virheen, siksi || "" -> // (undefined || '') = ''
    this.setState({
      loginid: this.props.userObj.loginId || "",
      username: this.props.userObj.userName || "",
      firstname: this.props.userObj.firstname || "",
      lastname: this.props.userObj.lastname || "",
      email: this.props.userObj.email || "",
      accesslevel: this.props.userObj.accessLevelId || "",
      password: this.props.userObj.password || "",
    });
  }

  // handleChangeKentänNimi – kullakin datakentällä on oma rutiini, joka vie muutetut tiedot stateen

  handleChangeUserName(event) {
    var syöte = event.target.value;
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

  handleChangeAccess(event) {
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

    // let apiUrl = "https://localhost:5001/nw/logins/" + this.state.loginid; // luodaan apumuuttuja apiUrl, jolle annetaan apikontrollerin route
    let apiUrl =
      "https://webapitesti.azurewebsites.net/nw/logins/" + this.state.loginid;

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userJson, // PUT-metodin body-osioon sijoitetaan ylempänä luotu userJson
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
    return (
      <div>
        {/* prettier-ignore */}
        <form onSubmit={this.handleSubmit}>
            
            <input type="text" value={this.state.loginid} title="LoginId" size="30" readOnly/> <label htmlFor="LoginId">LoginId</label><br/>
            <input type="text" value={this.state.username} placeholder="Username" onChange={this.handleChangeUserName} size="30" required/> <label>Username</label><br /> {/*onChange-eventin koodissa otetaan vastaan kenttään syötetty data ja päivitetään sillä state*/}
            <input type="text" value={this.state.firstname} placeholder="Firstname" onChange={this.handleChangeFirstName} size="30"/> <label>Firstname</label><br />
            <input type="text" value={this.state.lastname} placeholder="Lastname" onChange={this.handleChangeLastName} size="30"/> <label>Lastname</label><br /> 
            <select className="gray" value={this.state.accesslevel} name="AccessLevelID" onChange={this.handleChangeAccess}>
                <option className="gray" value="">AccessLevelID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                <option className="black" value="1">1</option>
                <option className="black" value="2">2</option>
                <option className="black" value="3">3</option>
                <option className="black" value="4">4</option>
                <option className="black" value="5">5</option>
            </select> <label>AccessLevelId</label> <br />
            <input type="email" value={this.state.email} placeholder="Email" onChange={this.handleChangeEmail} size="30"/> <label>Email</label> <br />
            <input type="password" placeholder="Password (min. 6 chars)" onChange={this.handleChangePassWord} size="30" minLength="6"/> <label>Password</label> <br />    
            <input type="password" placeholder="Confirm password" onChange={this.handleChangePassWord2} size="30" minLength="6" /> <label>Confirm password</label> <br />  
            <button type="submit" className="btn btn-primary">Tallenna käyttäjän muutokset</button>   
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

export default NWLoginsEdit;
