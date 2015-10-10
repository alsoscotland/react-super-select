var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react'),
    ReactSuperSelect = require('../src/react-super-select'),
    TestPageExampleOptionTemplate = require('./super-selects/support/test-page-example-option-template');

var testData = require('./super-selects/support/test-data.js'),
    mockAjaxPerPage = 10,
    lastPage = 0;

var RSSTestPageApp = React.createClass({

  handlerExample: function(newValue) {
    console.log(newValue);
  },

  _customMarkupMapper: function(item) {
    return(
    <TestPageExampleOptionTemplate key={item.id} option={item} />);
  },

  _simulatedAjaxFetch: function() {
    var data = _.take(testData, mockAjaxPerPage);
    // simulate a 2.5 second ajax fetch for collection data
    return {
      then: function(callback) {
        setTimeout(function() {
          callback(data);
        }, 2500);
      }
    };
  },

  _groupBy: 'size',

  _simulatedPageFetch: function(collection) {
    lastPage = lastPage + 1;
    var sliceLocation = lastPage * mockAjaxPerPage,
        data;
    if (sliceLocation < testData.length) {
      data = [];

      for (var i = sliceLocation; i < (sliceLocation + mockAjaxPerPage); i++) {
        if (testData[i]) {
          data.push(testData[i]);
        }
      }
    } else {
      data = testData;
    }

    return {
      then: function(callback) {
        setTimeout(function() {
          callback(collection.concat(data));
        }, 1500);
      }
    };
  },

  _hasMorePages: function(collection) {
    return collection.length < testData.length;
  },

  render: function() {
    return (
      <div>
        <section>
          <h1>Basic Example</h1>
          <ReactSuperSelect placeholder="Make a Selection" searchable={true} searchPlaceholder="search" dataSource={testData} onChange={this.handlerExample} />
        </section>
        <section>
          <h1>Custom Template Example</h1>
          <ReactSuperSelect groupBy={this._groupBy} placeholder="Make a Selection" customClassName="your-custom-wrapper-class" tags={true} initialValue={[testData[0], testData[4]]} searchable={true} searchPlaceholder="search" onChange={this.handlerExample} customOptionTemplateFunction={this._customMarkupMapper} dataSource={testData} />
        </section>
        <section>
          <h1>Ajax Example</h1>
          <ReactSuperSelect placeholder="Make a Selection" tags={true} searchable={true} searchPlaceholder="filter" onChange={this.handlerExample} ajaxDataFetch={this._simulatedAjaxFetch} pageDataFetch={this._simulatedPageFetch} hasMorePages={this._hasMorePages} />
        </section>
      </div>
    );
  }
});

React.render(<RSSTestPageApp />, document.getElementById('test_page_app'));
