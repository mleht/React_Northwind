import React, { Component } from "react";
import "./App.css";

class NWCustomerDelete extends Component {
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
    this.handlePerformDelete = this.handlePerformDelete.bind(this);
  }

  // componentDidMount() – ottaa vastaan emolta propsina tulevan dataobjektin "asiakasObj={this.state.yksiAsiakas}"" ja vie sen kentät stateen
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

  // handlePerformDelete – kutsuu tietokannastapoisto-rutiinia (estää samalla sivun uudelleenlatauksen preventDefault())
  handlePerformDelete(event) {
    // alert("Poistettava asiakas: " + this.state.CustomerID); // alert infona
    event.preventDefault();
    this.NWDeleteRestApista();
  }

  NWDeleteRestApista() {
    // let apiuri = "https://localhost:5001/nw/customer/" + this.state.CustomerID; // asiakasID parametrina apiin

    let apiuri =
      "https://webapitesti.azurewebsites.net/nw/customer/" +
      this.state.CustomerID;

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
                <input type="text" defaultValue={this.state.CustomerID} title="Asiakastunnus" size="30" readOnly/><br/>
                <input type="text" defaultValue={this.state.CompanyName} placeholder="CompanyName" title="CompanyName" size="30" readOnly/><br /> 
                <input type="text" defaultValue={this.state.ContactName} placeholder="ContactName" title="ContactName" size="30" readOnly/><br />
                <input type="text" defaultValue={this.state.ContactTitle} placeholder="ContactTitle" title="ContactTitle" size="30" readOnly/><br />
                <input type="text" defaultValue={this.state.Address} placeholder="Address" title="Address" size="30" readOnly/><br />
                <input type="text" defaultValue={this.state.PostalCode} placeholder="PostalCode" title="PostalCode" size="30" maxLength="10" readOnly/><br />
                <input type="text" defaultValue={this.state.City} placeholder="City" title="City" size="30" readOnly/><br />
                <input type="text" defaultValue={this.state.Country} placeholder="Country" title="Country" size="30" maxLength="15" readOnly/><br />
                <input type="text" defaultValue={this.state.Phone} placeholder="Phone" title="Phone" size="30" readOnly/><br />
                <input type="text" defaultValue={this.state.Fax} placeholder="Fax" title="Fax" size="30" readOnly/><br />
                <button className="btn btn-primary" onClick={this.handlePerformDelete}>Vahvista poisto</button>
            </form>
      </div>
    );
  }
}

export default NWCustomerDelete;
