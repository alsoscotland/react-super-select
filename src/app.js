var React = require('react'),
    ReactSuperSelect = require('react-super-select');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ReactSuperSelect placeholder="Make a Selection" searchable="true" searchPlaceholder="search" />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
