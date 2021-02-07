import React from "react";
import { Link } from "react-router-dom";

class NotFoundPage extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Hakemaasi sivua ei löytynyt</h1>
        <br />
        <br />
        <Link to="/">Etusivulle </Link>
      </div>
    );
  }
}
export default NotFoundPage;
