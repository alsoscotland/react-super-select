var _ = require('../node_modules/lodash'),
    React = require('react');

var ReactSuperSelect = React.createClass({displayName: "ReactSuperSelect",

  propTypes: {
    placeholder: React.PropTypes.string,
    noResultsString: React.PropTypes.string,
    onChange: React.PropTypes.func,
    externalMagnifierIconClasses: React.PropTypes.string,
    searchable: React.PropTypes.bool,
    remoteDataSourceFetchFunction: React.PropTypes.object,
    remoteDataSourceIsMultiPage: React.PropTypes.bool,
    dataSource: React.PropTypes.object,
    isMultiSelect: React.PropTypes.bool,
    optionsTemplate: React.PropTypes.object,
  },

  getInitialState: function() {
    return {
      isOpen: false
    };
  },

  _getClosedMarkup: function() {

  },

  _getOpenMarkup: function() {

  },

  render: function() {
    return (
      React.createElement("div", {className: "r-ss-wrap"}, 
        "react-super-select", 
        React.createElement("input", null), 
        React.createElement("button", {className: "r-ss-button"}, React.createElement("i", {className: "r-ss-magnifier"}, "search"))
    ));
  }

});

module.exports = ReactSuperSelect;
