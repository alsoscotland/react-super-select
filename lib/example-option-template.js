"use strict";

var React = require("react");

var ExampleOptionTemplate = React.createClass({
  displayName: "ExampleOptionTemplate",

  propTypes: {
    option: React.PropTypes.object
  },

  render: function render() {
    var name = this.props.option.name;
    return React.createElement(
      "div",
      { className: "r-ss-example-option" },
      React.createElement("img", { src: "//sitesbyscotland.com/images/monkeyTorso.png", height: "30" }),
      React.createElement(
        "strong",
        null,
        name
      )
    );
  }

});

module.exports = ExampleOptionTemplate;