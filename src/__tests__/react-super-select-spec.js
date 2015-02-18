jest.dontMock('lodash');
jest.dontMock('../react-super-select.js');

describe('ReactSuperSelect', function() {
  var React = require('react/addons'),
      _ = require('lodash'),
      ReactSuperSelect = require('../react-super-select.js'),
      TestUtils = React.addons.TestUtils;

  var renderComponent = function(userProps) {
    var props = _.extend({}, userProps);
    var reactComponent = React.createElement(ReactSuperSelect, props);
    return TestUtils.renderIntoDocument(reactComponent);
  };

  describe('render', function() {

    var el;

    beforeEach(function() {
      el = renderComponent({
        'placeholder': 'I am a placeholder'
      });
    });

    it('will render', function() {
      expect(el.getDOMNode()).toBeTruthy();
    });

    it('will render the trigger div', function() {
      var trigger = el.refs.triggerDiv;

      expect(trigger.getDOMNode()).toBeTruthy();
    });

    it('will render the carat span', function() {
      var carat = el.refs.carat;

      expect(carat.getDOMNode()).toBeTruthy();
    });

    it('carat span has up class when open', function() {
      var carat = el.refs.carat;
      el.setState({
        'isOpen': false
      });

      expect(carat.props.className.indexOf('up')).toBe(-1);
      expect(carat.props.className.indexOf('down')).toBeGreaterThan(-1);
    });

    it('carat span has down class when closed', function() {
      var carat = el.refs.carat;
      el.setState({
        'isOpen': true
      });

      expect(carat.props.className.indexOf('down')).toBe(-1);
      expect(carat.props.className.indexOf('up')).toBeGreaterThan(-1);
    });

    it('will render the readonly value display input', function() {
      var input = el.refs.valueDisplay

      expect(input.getDOMNode()).toBeTruthy();
    });

    it('readonly value display will show placeholder if provided', function() {
      var input = el.refs.valueDisplay

      expect(input.props.placeholder).toBe('I am a placeholder');
    });

    it('does not render dropdown when isOpen is false', function() {
      expect(el.refs.dropdownContent).toBeFalsy();
    });

  });

  describe('toggleDropdown', function() {

    var el;

    beforeEach(function() {
      el = renderComponent();
    });

    it('toggles dropdown on trigger click', function() {
      TestUtils.Simulate.click(el.refs.triggerDiv.getDOMNode(), {});

      expect(el.state.isOpen).toBe(true);

      TestUtils.Simulate.click(el.refs.triggerDiv.getDOMNode(), {});

      expect(el.state.isOpen).toBe(false);
    });

  });

  describe('hidden select element', function() {

    var mockData;

    beforeEach(function() {
      mockData = [
        {'id': 1, 'name': 'option one', 'blah': 'blah one'},
        {'id': 2, 'name': 'option two', 'blah': 'blah two'}
      ];
    });

    it('renders a hidden select element', function() {
      var el = renderComponent({});
      expect(el.refs.hiddenSelect).toBeTruthy();
    });

    it('renders options mapped from data source by name and id properties', function() {
      var optionElements,
          el = renderComponent({
            'dataSource': mockData
          });
      optionElements = TestUtils.scryRenderedDOMComponentsWithTag(el, 'option');

      expect(optionElements.length).toBe(mockData.length);
      expect(optionElements[0].props.value).toBe(1);
      expect(optionElements[0].props.children).toBe('option one');
    });

    it('renders options mapped from data source by user supplied properties properties', function() {
      var optionElements,
          el = renderComponent({
            'dataSource': mockData,
            'optionValueKey': 'blah',
            'optionLabelKey': 'id'
          });
      optionElements = TestUtils.scryRenderedDOMComponentsWithTag(el, 'option');

      expect(optionElements.length).toBe(mockData.length);
      expect(optionElements[0].props.value).toBe('blah one');
      expect(optionElements[0].props.children).toBe(1);
    });

  });

  describe('dropdownContent', function() {

    var el;

    beforeEach(function() {
      el = renderComponent();
      el.setState({
        'isOpen': true
      });
    });

    it('renders dropdown when isOpen is true', function() {
      expect(el.refs.dropdownContent).toBeTruthy();
    });

    it('does not render searchInput if searchable prop is false', function() {
      expect(el.refs.searchInput).toBeFalsy();
    });

    it('renders searchInput if searchable prop is true', function() {
      el.setProps({
        searchable: true
      });

      expect(el.refs.searchInput).toBeTruthy();
    });


    it('renders the default magnifier if a custom magnifier is not set', function() {
      el.setProps({
        searchable: true
      });
      var anchor = TestUtils.findRenderedDOMComponentWithClass(el, 'r-ss-magnifier');

      expect(anchor).toBeTruthy();
    });

    it('renders the user specified magnifier class if prop is set', function() {
      el.setProps({
        searchable: true,
        'externalSearchIconClass': 'boo-yahhhhhh'
      });

      var customAnchor = TestUtils.findRenderedDOMComponentWithClass(el, 'boo-yahhhhhh');

      expect(customAnchor).toBeTruthy();
    });

    it('renders searchInput placeholer when prop is provided', function() {
      el.setProps({
        searchable: true,
        searchPlaceholder: 'search placeholder'
      });

      expect(el.refs.searchInput.props.placeholder).toBe('search placeholder');
    });

  });

});
