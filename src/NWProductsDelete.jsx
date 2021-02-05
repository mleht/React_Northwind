import React, { Component } from "react";
import "./App.css";

class NWProductsDelete extends Component {
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
    this.handlePerformDelete = this.handlePerformDelete.bind(this);
  }

  // componentDidMount() – ottaa vastaan emolta propsina tulevan dataobjektin "tuoteObj={this.state.yksiTuote}" ja vie sen kentät stateen
  componentDidMount() {
    // boolean string vaihto
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

  // handlePerformDelete – kutsuu tietokannastapoisto-rutiinia (estää samalla sivun uudelleenlatauksen preventDefault())
  handlePerformDelete(event) {
    // alert("Poistettava tuote: " + this.state.productid); // alert infona
    event.preventDefault();
    this.NWDeleteRestApista();
  }

  NWDeleteRestApista() {
    // let apiuri = "https://localhost:5001/nw/products/" + this.state.productid; // loginID parametrina apiin
    let apiuri =
      "https://webapitesti.azurewebsites.net/nw/products/" +
      this.state.productid;

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
                <input type="text" defaultValue={this.state.productid} title="ProdudcId" size="30" readOnly/> <label>ProductId</label><br/>
                <input type="text" defaultValue={this.state.productname} size="30" readOnly/> <label>Productname</label><br /> 
                <input type="text" defaultValue={this.state.supplierid} size="30" readOnly/> <label>SupplierId</label><br />
                <input type="text" defaultValue={this.state.categoryid} size="30" readOnly/> <label>CategoryId</label><br /> 
                <input type="text" defaultValue={this.state.unitprice} size="30" readOnly/> <label>Unitproce</label><br /> 
                <input type="text" defaultValue={this.state.discontinued} size="30" readOnly/> <label>Discontinued</label><br /> 
                <button className="btn btn-primary" onClick={this.handlePerformDelete}>Vahvista poisto</button>
            </form>
      </div>
    );
  }
}

export default NWProductsDelete;
