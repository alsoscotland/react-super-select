var RSS_VERSION = "1.0.14";
import React from "react";
import ReactDOM from "react-dom";

class VersionPrinter extends React.Component {
  render() {
    return(<span>{RSS_VERSION}</span>);
  }
}

module.exports = VersionPrinter;
ReactDOM.render(<VersionPrinter />, document.getElementById('r_ss_version'));
