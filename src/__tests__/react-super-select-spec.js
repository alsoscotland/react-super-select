jest.dontMock('lodash');
jest.dontMock('../react-super-select.js');

describe('ReactSuperSelect', function() {
  var React = require('react/addons'),
      _ = require('lodash'),
      ReactSuperSelect = require('../react-super-select.js'),
      TestUtils = React.addons.TestUtils;

  var renderComponent = function(userProps) {
    var props = _.extend({}, {
      onChange: jest.genMockFunction()
    }, userProps);
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

    it('will render the mockInput value display anchor', function() {
      var mockInput = el.refs.valueDisplay;

      expect(mockInput.getDOMNode()).toBeTruthy();
    });

    it('trigger value display will show placeholder if provided', function() {
      var valueDisplay = el.refs.valueDisplay;

      expect(valueDisplay.props.children).toBe('I am a placeholder');
    });

    it('adds placeholder display class when value unset', function() {
      var valueDisplay = el.refs.valueDisplay;

      expect(valueDisplay.props.className.indexOf('r-ss-placeholder')).toBeGreaterThan(-1);
    });

    it('does not add placeholder display class when value set', function() {
      var valueDisplay = el.refs.valueDisplay;
      el.setState({
        value: 'blah'
      });

      expect(valueDisplay.props.className.indexOf('r-ss-placeholder')).toBe(-1);
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

    it('toggles dropdown on keypress of down arrow', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.down
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of space bar', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.space
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of enter key', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.enter
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('closes dropdown on keypress of esc key', function() {
      el.setState({
        isOpen: true
      });
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.esc
      });

      expect(el.state.isOpen).toBe(false);
    });

  });

  describe('focus handling', function() {

    it('focuses searchbox when searchable and expanded by keypress', function() {
      var el = renderComponent({
        searchable: true
      });
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.down
      });

      expect(document.activeElement).toBe(el.refs.searchInput.getDOMNode());
    });

    // TODO - why does JEST choke here despite this working in actual DOM?
    //        it does not seem to respect tabIndex focus on aTypical focus elements
    // it('focuses first options when not searchable and expanded by keypress', function() {
    //   var mockData = [
    //     {'id': 1, 'name': 'option one', 'blah': 'blah one'},
    //     {'id': 2, 'name': 'option two', 'blah': 'blah two'}
    //   ];
    //   el = renderComponent({
    //     searchable: false,
    //     'dataSource': mockData
    //   });
    //   TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
    //     which: el.keymap.down
    //   });

    //   expect(document.activeElement).toBe(el.refs.option_0.getDOMNode());
    // });

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

    var renderAndOpen = function(props) {
      var el = renderComponent(props);
      el.setState({
        isOpen: true
      });
      return el;
    };

    it('renders dropdown when isOpen is true', function() {
      var el = renderAndOpen();

      expect(el.refs.dropdownContent).toBeTruthy();
    });

    it('does not render searchInput if searchable prop is false', function() {
      var el = renderAndOpen({
        searchable: false
      });

      expect(el.refs.searchInput).toBeFalsy();
    });

    it('renders searchInput if searchable prop is true', function() {
      var el = renderAndOpen({
        searchable: true
      });

      expect(el.refs.searchInput).toBeTruthy();
    });

    it('renders the default magnifier if a custom magnifier is not set', function() {
      var el = renderAndOpen({
        searchable: true
      });
      var anchor = TestUtils.findRenderedDOMComponentWithClass(el, 'r-ss-magnifier');

      expect(anchor).toBeTruthy();
    });

    it('renders the user specified magnifier class if prop is set', function() {
      var el = renderAndOpen({
        searchable: true,
        'externalSearchIconClass': 'boo-yahhhhhh'
      });

      var customAnchor = TestUtils.findRenderedDOMComponentWithClass(el, 'boo-yahhhhhh');

      expect(customAnchor).toBeTruthy();
    });

    it('renders searchInput placeholer when prop is provided', function() {
      var el = renderAndOpen({
        searchable: true,
        searchPlaceholder: 'search placeholder'
      });

      expect(el.refs.searchInput.props.placeholder).toBe('search placeholder');
    });

    it('shows no results content when dataSource empty', function() {
      var el = renderAndOpen();

      expect(el.refs.noResults).toBeTruthy();
    });

    it('shows no results content with custom string when provided', function() {
      var el = renderAndOpen({
        noResultsString: 'blah'
      });

      expect(el.refs.noResults.props.children).toBe('blah');
    });

  });

  describe('dropdown template content', function() {

    var mockData;

    beforeEach(function() {
      mockData = [
        {'id': 1, 'name': 'option one', 'blah': 'blah one', 'fancyprop': 'I am a fancy one'},
        {'id': 2, 'name': 'option two', 'blah': 'blah two', 'fancyprop': 'I am a fancy two'}
      ];
    });

    it('renders the default list item content when no template is provided', function() {
      var el = renderComponent({
        dataSource: mockData
      });
      el.setState({
        isOpen: true
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(mockData.length);
    });

    it('renders custom list item content when a mapper function is provided', function() {
      var el = renderComponent({
        dataSource: mockData,
        customOptionTemplateFunction: function(option) {
          var text = option.name;
          return React.createElement("aside", {className: "custom-option"}, text);
        }
      });
      el.setState({
        isOpen: true
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'custom-option');

      expect(optionElements.length).toBe(mockData.length);
    });

  });

  describe('search results filter', function() {

    var mockData;

    beforeEach(function() {
      mockData = [
        {'id': 1, 'name': 'option one', 'blah': 'blah one', 'fancyprop': 'I am a fancy one'},
        {'id': 2, 'name': 'option two', 'blah': 'blah two', 'fancyprop': 'I am a fancy two'},
        {'id': 3, 'name': 'option three', 'blah': 'blah three', 'fancyprop': 'I am a fancy three'}
      ];
    });

    it('filters the default option list by label', function() {
      var el = renderComponent({
        'dataSource': mockData
      });
      el.setState({
        'isOpen': true,
        'searchString': 'two'
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(1);
    });

    it('filters by custom filter function', function() {
      var el = renderComponent({
        'dataSource': mockData,
        'customFilterFunction': function(option) {
          return (option.name.indexOf('option t') === 0);
        }
      });
      el.setState({
        'isOpen': true,
        'searchString': 'three'
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(2);
    });

  });

  describe('single item selection', function() {

    var mockData = [
          {'id': 1, 'name': 'option one', 'blah': 'blah one', 'fancyprop': 'I am a fancy one'},
          {'id': 2, 'name': 'option two', 'blah': 'blah two', 'fancyprop': 'I am a fancy two'}
        ],
        renderAndOpen = function(props) {
          var el = renderComponent(props);
          el.setState({
            isOpen: true
          });
          return el;
        };

    it('selects item by click', function() {
      var el = renderAndOpen({
        dataSource: mockData
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {});
    });

    it.only('selects item by keyup', function() {
      var el = renderAndOpen({
        dataSource: mockData
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      el._updateFocusedId(0);

      TestUtils.Simulate.keyUp(options[0], {
        which: el.keymap.enter
      });

      expect(el.state.value).toBe(mockData[0]);
    });

  });

});
