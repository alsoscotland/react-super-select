'use strict';

var _ = require('lodash'),
    React = require('react'),
    ReactSuperSelect = require('react-super-select'),
    ExampleOptionTemplate = require('./example-option-template');

var testData = require('./test-data.js'),
    mockAjaxPerPage = 10,
    lastPage = 0;

var App = React.createClass({
  displayName: 'App',

  handlerExample: function handlerExample(newValue) {
    console.log(newValue);
  },

  _customMarkupMapper: function _customMarkupMapper(item) {
    return React.createElement(ExampleOptionTemplate, { key: item.id, option: item });
  },

  _simulatedAjaxFetch: function _simulatedAjaxFetch() {
    var data = _.take(testData, mockAjaxPerPage);
    // simulate a 2.5 second ajax fetch for collection data
    return {
      then: function then(callback) {
        setTimeout(function () {
          callback(data);
        }, 2500);
      }
    };
  },

  _groupBy: 'size',

  _simulatedPageFetch: function _simulatedPageFetch(collection) {
    lastPage = lastPage + 1;
    var sliceLocation = lastPage * mockAjaxPerPage,
        data;
    if (sliceLocation < testData.length) {
      data = [];

      for (var i = sliceLocation; i < sliceLocation + mockAjaxPerPage; i++) {
        if (testData[i]) {
          data.push(testData[i]);
        }
      }
    } else {
      data = testData;
    }

    return {
      then: function then(callback) {
        setTimeout(function () {
          callback(collection.concat(data));
        }, 1500);
      }
    };
  },

  _hasMorePages: function _hasMorePages(collection) {
    return collection.length < testData.length;
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'section',
        { className: 'r-ss-example-section' },
        React.createElement(
          'h1',
          null,
          'Basic Example'
        ),
        React.createElement(ReactSuperSelect, { placeholder: 'Make a Selection', searchable: true, searchPlaceholder: 'search', dataSource: testData, onChange: this.handlerExample })
      ),
      React.createElement(
        'section',
        { className: 'r-ss-example-section' },
        React.createElement(
          'h1',
          null,
          'Custom Template Example'
        ),
        React.createElement(ReactSuperSelect, { groupBy: this._groupBy, placeholder: 'Make a Selection', customClassName: 'your-custom-wrapper-class', tags: true, multiple: true, searchable: true, searchPlaceholder: 'search', onChange: this.handlerExample, customOptionTemplateFunction: this._customMarkupMapper, dataSource: testData })
      ),
      React.createElement(
        'section',
        { className: 'r-ss-example-section' },
        React.createElement(
          'h1',
          null,
          'Ajax Example'
        ),
        React.createElement(ReactSuperSelect, { placeholder: 'Make a Selection', tags: true, searchable: true, searchPlaceholder: 'filter', onChange: this.handlerExample, ajaxDataFetch: this._simulatedAjaxFetch, pageDataFetch: this._simulatedPageFetch, hasMorePages: this._hasMorePages })
      )
    );
  }
});

React.render(React.createElement(App, null), document.getElementById('app'));