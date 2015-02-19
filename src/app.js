var React = require('react'),
    ReactSuperSelect = require('react-super-select');


var testData = require('./test-data.js');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ReactSuperSelect placeholder="Make a Selection" searchable={true} searchPlaceholder="search" dataSource={testData} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
