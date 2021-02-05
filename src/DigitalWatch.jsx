import React, { Component } from "react";
import "./App.css";
import "react-clock/dist/Clock.css";

class Kello extends Component {
  // lisätään digitalwatch renderiin tämän kellokomponentin kutsu
  state = {};
  render() {
    return <h4>Kellonaika: {this.props.kellonaika}</h4>;
    // Tämän kellokomponentin props on kellonaika. Alhaalla Digitalwatch kutsussa <Kello kellonaika={this.state.time} />
    // this.state.time tulee alla digitalwatchissa. Eli propsin sisältö päivittyy automaattisesti toisin kuin viesteissä oli kovakoodattu
  }
}

class DigitalWatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };
  }

  componentDidMount() {
    // tähän luodaan intervalli 1000 ms eli sekunnin välein
    // => on ES6 arrow funktio (kts. googlella lisää esim. https://www.w3schools.com/js/js_arrow_function.asp)
    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  tick() {
    // aina kun intervalli yllä laukeaa se kutsuu tätä tickkiä ja katsoo mikä hetki tällä hetkellä on
    this.setState({
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    });
  }

  componentWillUnmount() {
    // componentWillUnmount is the last function to be called immediately before the component is removed from the DOM. It is generally used to perform clean-up for any DOM-elements or timers created in componentWillMoun
    clearInterval(this.intervalID);
  }

  render() {
    return (
      <div className="digitaalikello">
        <p>Kellonaika: {this.state.time}</p>
        <p>Päivämäärä: {this.state.date}</p>
        <Kello kellonaika={this.state.time} />
      </div>
    );
  }
}

export default DigitalWatch;
