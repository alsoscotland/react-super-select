var React = require('react');

var TestPageExampleOptionTemplate = React.createClass({

  propTypes: {
    option: React.PropTypes.object
  },

  render: function() {
    var name = this.props.option.name;

    return (
      <div className="r-ss-example-option">
        <img src="//sitesbyscotland.com/images/monkeyTorso.png" height="30" />
        <strong>{name}</strong>
      </div>);
  }

});

module.exports = TestPageExampleOptionTemplate;
