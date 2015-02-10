var React = require('react'),
  ReactSuperSelect = require('react-super-select');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ReactSuperSelect />
      </div>
    )
  }
});

React.render(<App />, document.getElementById('app'));
