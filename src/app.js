var React = require('react'),
    ReactSuperSelect = require('react-super-select'),
    ExampleOptionTemplate = require('./example-option-template');

var testData = require('./test-data.js');

var App = React.createClass({


  _customMarkupMapper: function(item) {
    return(
    <ExampleOptionTemplate option={item} />);
  },

  render: function() {
    return (
      <div>
        <section className="r-ss-example-section">
          <h1>Basic Example</h1>
          <ReactSuperSelect placeholder="Make a Selection" searchable={true} searchPlaceholder="search" dataSource={testData} />
        </section>
        <section className="r-ss-example-section">
          <h1>Custom Template Example</h1>
          <ReactSuperSelect placeholder="Make a Selection" searchable={true} searchPlaceholder="search" customOptionsMapper={this._customMarkupMapper} dataSource={testData} />
        </section>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
