"use strict";

var React = require("react"),
    ReactSuperSelect = require("react-super-select"),
    ExampleOptionTemplate = require("./example-option-template");

var testData = require("./test-data.js");

var App = React.createClass({
  displayName: "App",

  handlerExample: function handlerExample(newValue) {
    console.log(newValue);
  },

  _customMarkupMapper: function _customMarkupMapper(item) {
    return React.createElement(ExampleOptionTemplate, { option: item });
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "section",
        { className: "r-ss-example-section" },
        React.createElement(
          "h1",
          null,
          "Basic Example"
        ),
        React.createElement(ReactSuperSelect, { placeholder: "Make a Selection", searchable: true, searchPlaceholder: "search", dataSource: testData, onChange: this.handlerExample })
      ),
      React.createElement(
        "section",
        { className: "r-ss-example-section" },
        React.createElement(
          "h1",
          null,
          "Custom Template Example"
        ),
        React.createElement(ReactSuperSelect, { placeholder: "Make a Selection", searchable: true, searchPlaceholder: "search", onChange: this.handlerExample, customOptionsMapper: this._customMarkupMapper, dataSource: testData })
      )
    );
  }
});

React.render(React.createElement(App, null), document.getElementById("app"));