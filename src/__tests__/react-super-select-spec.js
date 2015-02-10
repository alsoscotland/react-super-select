jest.dontMock('../react-super-select.js');

describe('ReactSuperSelect', function() {
  var React = require('react/addons'),
      _ = require('lodash'),
      ReactSuperSelect = require('../react-super-select.js'),
      TestUtils = React.addons.TestUtils;

  var renderComponent = function(props) {
    props = _.extend({}, props);
    var reactComponent = React.createElement(ReactSuperSelect, props);
    return TestUtils.renderIntoDocument(reactComponent);
  };

  describe('render', function() {

    var el;

    beforeEach(function() {
      el = renderComponent();
    });

    it('will render', function() {
      console.log('running');
      expect(el.getDOMNode()).toBeTruthy();
    });

  });

});
