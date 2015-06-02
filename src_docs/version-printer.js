var RSS_VERSION = "0.1.7";
var React = require('react');

var VersionPrinter = React.createClass({
  render: function() {
    return(<span>{RSS_VERSION}</span>);
  }
});

module.exports = VersionPrinter;
React.render(<VersionPrinter />, document.getElementById('r_ss_version'));
