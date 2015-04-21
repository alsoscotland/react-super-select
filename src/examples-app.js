var _ = require('lodash'),
    React = require('react'),
    ReactSuperSelect = require('./react-super-select');
    // ExampleOptionTemplate = require('./example-option-template');

// var testData = require('./test-data.js'),
//     mockAjaxPerPage = 10,
//     lastPage = 0;

var allExamples = require('./examples/all-examples');

var App = React.createClass({

  // handlerExample: function(newValue) {
  //   console.log(newValue);
  // },

  // _customMarkupMapper: function(item) {
  //   return(
  //   <ExampleOptionTemplate key={item.id} option={item} />);
  // },

  // _simulatedAjaxFetch: function() {
  //   var data = _.take(testData, mockAjaxPerPage);
  //   // simulate a 2.5 second ajax fetch for collection data
  //   return {
  //     then: function(callback) {
  //       setTimeout(function() {
  //         callback(data);
  //       }, 2500);
  //     }
  //   };
  // },

  // _groupBy: 'size',

  // _simulatedPageFetch: function(collection) {
  //   lastPage = lastPage + 1;
  //   var sliceLocation = lastPage * mockAjaxPerPage,
  //       data;
  //   if (sliceLocation < testData.length) {
  //     data = [];

  //     for (var i = sliceLocation; i < (sliceLocation + mockAjaxPerPage); i++) {
  //       if (testData[i]) {
  //         data.push(testData[i]);
  //       }
  //     }
  //   } else {
  //     data = testData;
  //   }

  //   return {
  //     then: function(callback) {
  //       var complete = ((collection.length + data.length) >= testData.length),
  //           pagingData = {
  //             collection: complete ? testData : collection.concat(data),
  //             complete: complete
  //           };
  //       setTimeout(function() {
  //         callback(pagingData);
  //       }, 1500);
  //     }
  //   };
  // },


  _renderExampleLinks: function() {
    var exampleLinks = _.map(allExamples, function(example, index) {
      var href = '#' + example.nameAttr;
      return (<li key={index}><a href={href}> {example.displayName} </a></li>);
    });

    return( <div className="example-links">
              <h3>Live Examples</h3>
              <h4> Example Links: </h4>
              <nav className="api">
               <ul>
                 {exampleLinks}
               </ul>
              </nav>
            </div>);
  },

  _renderExampleSections: function() {
    var exampleSections = _.map(allExamples, function(example, index) {
      var superSelect = React.createElement(ReactSuperSelect, example.props),
          outputId = example.nameAttr + '_output',
          propsCode = _.each(_.pairs(example.props), function(pairArray) {
            return (
              <pre><code>
              {pairArray[0]}
              <pre dangerouslySetInnerHTML={{__html: JSON.stringify(pairArray[1])}}></pre>
              </code></pre>
              );
          });
      return( <li key={index} className="example-sections">
              <article className="api-item">
                <h4 className="api-link">
                  <a name={example.nameAttr}> {example.displayName} </a>
                </h4>
                <div className="rss-output-example">onChange Output</div>
                <pre className="example-output" id={outputId}> </pre>
                <div>
                  {superSelect}
                </div>
                <div className="props-code">
                <div>
                ```html
                {example.renderString}
                ```
                </div>
                {propsCode}
                </div>
              </article>
            </li>);
    });

    // TODO example markup
    return(<ul className="live-examples">
        {exampleSections}
      </ul>);

  },

  render: function() {
    return (<div>
      {this._renderExampleLinks()}
      {this._renderExampleSections()}
    </div>);
    // return (
    //   <div>
    //     <section className="r-ss-example-section">
    //       <h1>Basic Example</h1>
    //       <ReactSuperSelect placeholder="Make a Selection" searchable={true} searchPlaceholder="search" dataSource={testData} onChange={this.handlerExample} />
    //     </section>
    //     <section className="r-ss-example-section">
    //       <h1>Custom Template Example</h1>
    //       <ReactSuperSelect groupBy={this._groupBy} placeholder="Make a Selection" customClassName="your-custom-wrapper-class" multiple={true} tags={true} searchable={true} searchPlaceholder="search" onChange={this.handlerExample} customOptionTemplateFunction={this._customMarkupMapper} dataSource={testData} />
    //     </section>
    //     <section className="r-ss-example-section">
    //       <h1>Ajax Example</h1>
    //       <ReactSuperSelect placeholder="Make a Selection" tags={true} searchable={true} searchPlaceholder="filter" onChange={this.handlerExample} ajaxDataSource={this._simulatedAjaxFetch} pageFetch={this._simulatedPageFetch} />
    //     </section>
    //   </div>
    // );
  }
});

React.render(<App />, document.getElementById('examples'));
