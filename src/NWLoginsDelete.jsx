import React, { Component } from "react";
import "./App.css";

class NWLoginsDelete extends Component {
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
    this.handlePerformDelete = this.handlePerformDelete.bind(this);
  }

  // componentDidMount() – ottaa vastaan emolta propsina tulevan dataobjektin "asiakasObj={this.state.yksiAsiakas}"" ja vie sen kentät stateen
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

  // handlePerformDelete – kutsuu tietokannastapoisto-rutiinia (estää samalla sivun uudelleenlatauksen preventDefault())
  handlePerformDelete(event) {
    // alert("Poistettava asiakas: " + this.state.loginid); // alert infona
    event.preventDefault();
    this.NWDeleteRestApista();
  }

  NWDeleteRestApista() {
    // let apiuri = "https://localhost:5001/nw/logins/" + this.state.loginid; // loginID parametrina apiin
    let apiuri =
      "https://webapitesti.azurewebsites.net/nw/logins/" + this.state.loginid;
    let jwToken = localStorage.getItem("token"); // token localstorages jwToken muuttujaan

    fetch(apiuri, {
      method: "DELETE", // Delete metodi REST-apiin
      headers: {
        Authorization: "Bearer " + jwToken, // tässä lähetetään token apiin
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: null,
    })
      .then((response) => response.json())
      .then((json) => {
        const success = json;
        if (success) {
          alert(`Response from server: ${success}.`);
          this.dismiss();
        }
      });
  }

  // * Onnistuneen kantapoiston jälkeen syöttölomake pyytää emokomponenttia sulkemaan itsensä "this.dismiss()"
  // * Tuo kutsuu metodia dismiss (alla) joka kutsuu emon puolelta unmountme propsia jossa kutsu unmountMe={this.handleChildUnmountDelete}
  dismiss() {
    this.props.unmountMe();
  }

  // render() – luo input-kentistä koostuvan HTML-formin ja näyttää propsina stateen saadun datan kentissä readonlyna poistossa. Valuen sijaan defaultvalue samasta syystä. Muuten consolessa error.
  render() {
    return (
      <div>
        {/* prettier-ignore */}
        <form>
                <input type="text" defaultValue={this.state.loginid} title="LoginId" size="30" readOnly/> <label>LoginId</label><br/>
                <input type="text" defaultValue={this.state.username} size="30" readOnly/> <label>Username</label><br /> 
                <input type="text" defaultValue={this.state.firstname} size="30" readOnly/> <label>Firstname</label><br />
                <input type="text" defaultValue={this.state.lastname} size="30" readOnly/> <label>Lastname</label><br /> 
                <input type="text" defaultValue={this.state.accesslevel} size="30" readOnly/> <label>AccessLevelId</label><br /> 
                <input type="text" defaultValue={this.state.email} size="30" readOnly/> <label>Email</label><br /> 
                <button className="btn btn-primary" onClick={this.handlePerformDelete}>Vahvista poisto</button>
            </form>
      </div>
    );
  }
}

export default NWLoginsDelete;
