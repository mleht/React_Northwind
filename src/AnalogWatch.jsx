import React, { Component } from "react";
import Clock from "react-clock";
import "./App.css";
import "react-clock/dist/Clock.css";

class AnalogWatch extends Component {
  constructor(props) {
    super(props);
    console.log("AnalogWatch: Constructror-metodissa"); // Loggaus testausta varten (F12)
    this.state = {
      pvm: new Date(),
    };
  }

  componentDidMount() {
    // tähän luodaan intervalli 1000 ms eli sekunnin välein
    // => on ES6 arrow funktio (kts. googlella lisää esim. https://www.w3schools.com/js/js_arrow_function.asp)
    this.intervalID = setInterval(() => this.tick(), 1000);
    // console.log("AnalogWatch: ComponentDidMount-metodissa"); // Loggaus testausta varten (F12)
  }

  tick() {
    // aina kun intervalli yllä laukeaa se kutsuu tätä tickkiä ja katsoo mikä hetki tällä hetkellä on
    this.setState({
      pvm: new Date(),
    });
    // console.log("AnalogWatch: Tick-metodissa"); // Loggaus testausta varten (F12)
  }

  componentWillUnmount() {
    // componentWillUnmount is the last function to be called immediately before the component is removed from the DOM. It is generally used to perform clean-up for any DOM-elements or timers created in componentWillMoun
    clearInterval(this.intervalID);
    // console.log("AnalogWatch: ComponentWillUnmount-metodissa"); // Loggaus testausta varten (F12)
  }

  render() {
    // console.log("AnalogWatch: Render-metodissa"); // Loggaus testausta varten (F12)
    return (
      <div className="centered">
        <Clock value={this.state.pvm} />
      </div>
    );
  }
}

export default AnalogWatch;
