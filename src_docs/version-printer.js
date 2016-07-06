var RSS_VERSION = "0.5.3";
var React = require('react'),
    ReactDOM = require('react-dom');

var VersionPrinter = React.createClass({
  render: function() {
    return(<span>{RSS_VERSION}</span>);
  }
});

module.exports = VersionPrinter;
ReactDOM.render(<VersionPrinter />, document.getElementById('r_ss_version'));
