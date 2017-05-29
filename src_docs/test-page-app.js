import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import ReactSuperSelect from "../src/react-super-select";
import testData from "./super-selects/support/test-data.js";
import TestPageExampleOptionTemplate from "./super-selects/support/test-page-example-option-template";

const mockAjaxPerPage = 10;
let lastPage = 0;

class RSSTestPageApp extends React.Component{
  constructor(props) {
    super(props);

    _.bindAll(this, [
      "_renderPropsLinks",
      "_renderProps"
    ]);

    this._groupBy = 'size';

  }

  render() {
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

  handlerExample(newValue) {
    console.info(newValue);
  }

  _customMarkupMapper(item) {
    return(
    <TestPageExampleOptionTemplate key={item.id} option={item} />);
  }

  _simulatedAjaxFetch() {
    const data = _.take(testData, mockAjaxPerPage);
    // simulate a 2.5 second ajax fetch for collection data
    return {
      then: function(callback) {
        setTimeout(function() {
          callback(data);
        }, 2500);
      }
    };
  }

  _simulatedPageFetch(collection) {
    lastPage = lastPage + 1;
    const sliceLocation = lastPage * mockAjaxPerPage;

    let data;

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
  }

  _hasMorePages(collection) {
    return collection.length < testData.length;
  }
}

ReactDOM.render(<RSSTestPageApp />, document.getElementById('test_page_app'));
