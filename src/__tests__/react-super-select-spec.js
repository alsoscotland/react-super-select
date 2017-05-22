jest.dontMock('lodash');
jest.dontMock('../react-super-select.js');

import _ from "lodash";
import React from "react";
import ReactSuperSelect from "../react-super-select.js";
import TestUtils from "react-dom/test-utils";

const optOne = {
      id: 1,
      name: "Test Option 1",
      foo: "Foo1",
      bar: "Bar1"
    },
    optTwo = {
      id: 2,
      name: "Test Option 2",
      foo: "Foo2",
      bar: "Bar2"
    };

class TestHelperComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clearSelectedValueOnDataSourceChange: false,
      dataSource: [optOne, optTwo],
      initialValue: optOne,
      optionLabelKey: undefined,
      optionValueKey: undefined
    };
  }

  render() {
    return React.createElement(ReactSuperSelect, {
              ref: (c) => {this.rss = c },
              onChange: _.noop,
              clearSelectedValueOnDataSourceChange: this.state.clearSelectedValueOnDataSourceChange,
              dataSource: this.state.dataSource,
              initialValue: this.state.initialValue,
              optionLabelKey: this.state.optionLabelKey,
              optionValueKey: this.state.optionValueKey
            });
  }
}

describe('ReactSuperSelect', function() {
  const mockData = [
          {'id': 1, 'name': 'option one', 'blah': 'blah one', 'fancyprop': 'I am a fancy one', 'type': 'widget'},
          {'id': 2, 'name': 'option two', 'blah': 'blah two', 'fancyprop': 'I am a fancy two', 'type': 'whatzit'},
          {'id': 3, 'name': 'option three', 'blah': 'blah three', 'fancyprop': 'I am a fancy three', 'type': 'thingamajig'},
          {'id': 4, 'name': 'option four', 'blah': 'blah four', 'fancyprop': 'I am a fancy four', 'type': 'whatzit'},
          {'id': 5, 'name': 'option five', 'blah': 'blah five', 'fancyprop': 'I am a fancy five', 'type': 'widget'}
      ],
      mockDataWithDisabledOption = _.clone(mockData);

  mockDataWithDisabledOption[1] = _.extend({}, mockDataWithDisabledOption[1], {disabled: true});

  const renderComponent = function(userProps) {
    const props = _.extend({}, {
      onChange: jest.genMockFunction(),
      dataSource: mockData
    }, userProps);
    const reactComponent = React.createElement(ReactSuperSelect, props);
    return TestUtils.renderIntoDocument(reactComponent);
  };

  const renderAndOpen = function(props) {
    const el = renderComponent(props);
    el.setState({
      isOpen: true
    });
    return el;
  };

  describe('render', function() {
    var el;

    beforeEach(function() {
      el = renderComponent({
        'placeholder': 'I am a placeholder'
      });
    });

    it('will render', function() {
      expect(el).toBeTruthy();
    });

    it('will render the trigger div', function() {
      expect(el._rssDOM.triggerDiv).toBeTruthy();
    });

    it('will render the carat span', function() {
      expect(el._rssDOM.carat).toBeTruthy();
    });

    it('carat span has up class when open', function() {
      var carat = el._rssDOM.carat;
      el.setState({
        isOpen: false
      });

      expect(carat.getAttribute("class").indexOf('up')).toBe(-1);
      expect(carat.getAttribute("class").indexOf('down')).toBeGreaterThan(-1);
    });

    it('carat span has down class when closed', function() {
      var carat = el._rssDOM.carat;
      el.setState({
        isOpen: true
      });

      expect(carat.getAttribute("class").indexOf('down')).toBe(-1);
      expect(carat.getAttribute("class").indexOf('up')).toBeGreaterThan(-1);
    });

    it('trigger value display will show placeholder if provided', function() {
      var triggerDiv = el._rssDOM.triggerDiv;
      expect(triggerDiv.childNodes[1].textContent).toBe('I am a placeholder');
    });

    it('adds placeholder display class when value unset', function() {
      var triggerDiv = el._rssDOM.triggerDiv;
      expect(triggerDiv.getAttribute("class").indexOf('r-ss-placeholder')).toBeGreaterThan(-1);
    });

    it('does not add placeholder display class when value set', function() {
      var triggerDiv = el._rssDOM.triggerDiv;
      el.setState({
        value: ['foo']
      });

      expect(triggerDiv.getAttribute("class").indexOf('r-ss-placeholder')).toBe(-1);
    });

    it('does not render dropdown when isOpen is false', function() {
      expect(el._rssDOM.dropdownContent).toBeFalsy();
    });
  });

  describe('aria-attributes', function() {
    it('will use a supplied controlId prop', function() {
      var el = renderComponent({
        controlId: "my_id"
      });

      expect(el.state.controlId).toBe('my_id');
    });

    it('adds required aria attributes to the triggerDiv', function() {
      var el = renderComponent();

      expect(el._rssDOM.triggerDiv.getAttribute("role")).toBe('combobox');
      expect(el._rssDOM.triggerDiv.getAttribute("aria-activedescendant")).not.toBeUndefined();
      expect(el._rssDOM.triggerDiv.getAttribute("aria-haspopup")).toBeTruthy();
      expect(el._rssDOM.triggerDiv.getAttribute("aria-disabled")).toBe('false');
      expect(el._rssDOM.triggerDiv.getAttribute("aria-controls")).toBe(el._ariaGetListId());
      expect(_.isString(el._rssDOM.triggerDiv.getAttribute("aria-label"))).toBe(true);
      expect(el._rssDOM.triggerDiv.getAttribute("aria-multiselectable")).toBe(el._isMultiSelect().toString());
      expect(el._rssDOM.triggerDiv.getAttribute("tabIndex")).toBe('0');
    });

    it('triggerDiv tracks focused option as aria-active-descendant', function() {
      var el = renderAndOpen({
        dataSource: mockData
      });

      expect(el._rssDOM.triggerDiv.getAttribute("aria-activedescendant")).toBeFalsy();
      el._updateFocusedId(0);
      expect(el._rssDOM.triggerDiv.getAttribute("aria-activedescendant")).toBeTruthy();
      expect(el._rssDOM.triggerDiv.getAttribute("aria-activedescendant")).toBe(el._ariaGetActiveDescendentId());
    });

    it('adds required aria attributes to the dropdownList', function() {
      var el = renderAndOpen({
        dataSource: mockData
      });

      expect(el._rssDOM.dropdownOptionsList.getAttribute("role")).toBe('listbox');
      expect(el._rssDOM.dropdownOptionsList.getAttribute("id")).toBe(el._ariaGetListId());
      expect(el._rssDOM.dropdownOptionsList.getAttribute("aria-expanded")).toBeTruthy();
      expect(el._rssDOM.dropdownOptionsList.getAttribute("tabIndex")).toBe('-1');
    });

    it('adds required aria attributes to the searchInput', function() {
      var el = renderAndOpen({
        dataSource: mockData,
        searchable: true
      });

      expect(el._rssDOM.searchInput.getAttribute('aria-labelledby')).toBe(el._rssDOM.searchInputLabel.getAttribute("id"));
      expect(el._rssDOM.searchInput.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('adds aria-selected attribute to all options', function() {
      var el = renderAndOpen({
        dataSource: mockData
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      el.toggleDropdown();
      options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      expect(options[0].getAttribute("aria-selected")).toBe('false');
      expect(options[1].getAttribute("aria-selected")).toBe('true');
      expect(options[2].getAttribute("aria-selected")).toBe('false');
      expect(options[3].getAttribute("aria-selected")).toBe('false');
      expect(options[4].getAttribute("aria-selected")).toBe('false');
    });
  });

  describe('disabled property', function() {

    var el;

    beforeEach(function() {
      el = renderComponent({
        disabled: true
      });
    });

    it('will render in a disabled state', function() {
      expect(el._rssDOM.triggerDiv.getAttribute("aria-disabled")).toBe('true');
      expect(el._rssDOM.triggerDiv.getAttribute("class").indexOf('disabled')).toBeGreaterThan(-1);
    });

    it('will not toggle when in disabled state', function() {
      el.toggleDropdown();
      expect(el.state.isOpen).toBe(false);
    });

  });

  describe('onOpenDropdown and onCloseDropdown handlers', function() {
    var el;

    beforeEach(function() {
      el = renderComponent({
        onCloseDropdown: jest.genMockFunction(),
        onOpenDropdown: jest.genMockFunction()
      });
    });

    it('will fire the onOpenDropdown handler', function() {
      expect(el.props.onOpenDropdown.mock.calls.length).toBe(0);

      el.toggleDropdown();

      expect(el.props.onOpenDropdown.mock.calls.length).toBe(1);
    });

    it('will fire the onCloseDropdown handler', function() {
      expect(el.props.onCloseDropdown.mock.calls.length).toBe(0);

      el.toggleDropdown();

      expect(el.props.onCloseDropdown.mock.calls.length).toBe(0);

      el.toggleDropdown();

      expect(el.props.onCloseDropdown.mock.calls.length).toBe(1);
    });

  });

  describe('clearSelection button', function() {

    it('does not render clear selection button when nothing is selected', function() {
      var el = renderComponent({
        dataSource: {
          collection: mockData
        },
        multiple: true
      });

      expect(el._rssDOM.selectionClear).toBeUndefined();
    });

    it('does not render clear selection button when clearable is false', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          clearable: false,
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      expect(el._rssDOM.selectionClear).toBeUndefined();
    });

    it('renders clear selection button when values are selected', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      expect(el._rssDOM.selectionClear).toBeTruthy();
    });

    it('clears selection when clear selection button is clicked', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      TestUtils.Simulate.click(el._rssDOM.selectionClear, {type: 'click'});
      expect(_.isEmpty(el.state.value)).toBe(true);
    });

    it('clears selection when clear selection button receives space-bar keyDown', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      TestUtils.Simulate.keyDown(el._rssDOM.selectionClear, {
        which: el.keymap.space
      });
      expect(_.isEmpty(el.state.value)).toBe(true);
    });

    it('clears selection when clear selection button receives enter keyDown', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      TestUtils.Simulate.keyDown(el._rssDOM.selectionClear, {
        which: el.keymap.space
      });
      expect(_.isEmpty(el.state.value)).toBe(true);
    });

    it('if dropdown open, calls _setFocusOnOpen after clear', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      el.toggleDropdown();

      var setFocusSpy = spyOn(el, '_setFocusOnOpen').and.callThrough();

      TestUtils.Simulate.keyDown(el._rssDOM.selectionClear, {
        which: el.keymap.space
      });

      expect(setFocusSpy).toHaveBeenCalled();
    });

    it('it clears lastUserSelectedOption', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      el.lastUserSelectedOption = 'faksenode';

      TestUtils.Simulate.keyDown(el._rssDOM.selectionClear, {
        which: el.keymap.space
      });

      expect(el.lastUserSelectedOption).toBeUndefined();
    });
  });

  describe('initialValue', function() {
    it('will preselect an array of options provided to the initialValue prop', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: [mockData[2], mockData[4]]
        });

      expect(_.isEqual(el.state.value, [mockData[2], mockData[4]])).toBe(true);
    });

    it('will preselect options provided to the initialValue prop', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: true,
          initialValue: mockData[2]
        });

      expect(_.isEqual(el.state.value, [mockData[2]])).toBe(true);
    });

    it('will preselect only one option if provided an array to the initialValue prop in a non-multi-select', function() {
      var el = renderComponent({
          dataSource: {
            collection: mockData
          },
          multiple: false,
          tags: false,
          initialValue: [mockData[2], mockData[4]]
        });

      expect(_.isEqual(el.state.value, [mockData[2]])).toBe(true);
    });
  });

  describe('dataSource overloads', function() {
    it('supports a getting options from an object with a collection property', function() {
      var el = renderComponent({
        dataSource: {
          collection: mockData
        }
      });
      expect(el.state.data).toBe(mockData);
    });

    it('supports a getting options from an object with a get function', function() {
      var el = renderComponent({
        dataSource: {
          internals: {
            collection: mockData
          },
          get: function(key) {
            return this.internals[key];
          }
        }
      });
      expect(el.state.data).toBe(mockData);
    });
  });

  describe('toggleDropdown', function() {
    var el;

    beforeEach(function() {
      el = renderComponent();
    });

    it('toggles dropdown on trigger click', function() {
      TestUtils.Simulate.click(el._rssDOM.triggerDiv, {});

      expect(el.state.isOpen).toBe(true);

      TestUtils.Simulate.click(el._rssDOM.triggerDiv, {});

      expect(el.state.isOpen).toBe(false);
    });

    it('toggles dropdown on keypress of down arrow', function() {
      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.down
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on alt-keypress of down arrow', function() {
      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        altKey: true,
        which: el.keymap.down
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of space bar', function() {
      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.space
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of enter key', function() {
      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.enter
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of space key', function() {
      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.space
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('closes dropdown on keypress of esc key', function() {
      el.toggleDropdown();

      el._rssDOM.triggerDiv.focus();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.esc
      });

      expect(el.state.isOpen).toBe(false);
      expect(document.activeElement).toBe(el._rssDOM.triggerDiv);
    });

    it('closes dropdown on keypress of alt-up arrow', function() {
      el.setState({
        isOpen: true
      });

      el._rssDOM.triggerDiv.focus();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.up,
        altKey: true
      });

      expect(el.state.isOpen).toBe(false);
      expect(document.activeElement).toBe(el._rssDOM.triggerDiv);
    });

    it('calls _setFocusOnOpen after opening', function() {
      var setFocusSpy = spyOn(el, '_setFocusOnOpen').and.callThrough();

      el.toggleDropdown();

      expect(setFocusSpy).toHaveBeenCalled();
    });

    it('clears focusedId if closing', function() {
      el.toggleDropdown();
      el.setState({
        focusedId: 1
      });
      el.toggleDropdown();
      expect(el.state.focusedId).toBeUndefined();
    });
  });

  describe('focus handling', function() {
    it('focuses searchbox when searchable and expanded by keypress', function() {
      var el = renderComponent({
        searchable: true
      });
      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        altKey: true,
        which: el.keymap.down
      });

      expect(document.activeElement).toBe(el._rssDOM.searchInput);
    });

    it('focuses first option when not searchable and expanded by keypress', function() {
      var el = renderComponent({
        searchable: false
      });
      var focusSpy = spyOn(el, '_focusDOMOption').and.callThrough();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.down,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(0);
    });

    it('focuses first option on home key keypress', function() {
      var el = renderComponent();
      var focusSpy = spyOn(el, '_focusDOMOption').and.callThrough();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.home,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(0);
    });

    it('focuses last option on end key keypress', function() {
      var el = renderComponent();
      var focusSpy = spyOn(el, '_focusDOMOption').and.callThrough();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.end,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(mockData.length - 1);
    });

    it('focuses lastUserSelectedOption when set', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[3]);

      var focusSpy = spyOn(el, '_focusDOMOption').and.callThrough();
      el.toggleDropdown();

      expect(focusSpy).toHaveBeenCalled();
      // also verifying that lastUserSelectedOption is set to the correct option
      expect(options[3].getAttribute('data-option-value')).toBe(el.lastUserSelectedOption.getAttribute('data-option-value'));
      expect(el.state.focusedId).toBe(3);
    });
  });

  describe('dropdownContent', function() {
    it('renders dropdown when isOpen is true', function() {
      var el = renderAndOpen();

      expect(el._rssDOM.dropdownContent).toBeTruthy();
    });

    it('does not render searchInput if searchable prop is false', function() {
      var el = renderAndOpen({
        searchable: false
      });

      expect(el._rssDOM.searchInput).toBeFalsy();
    });

    it('renders searchInput if searchable prop is true', function() {
      var el = renderAndOpen({
        searchable: true
      });

      expect(el._rssDOM.searchInput).toBeTruthy();
    });

    it('renders the default magnifier if a custom magnifier is not set', function() {
      var el = renderAndOpen({
        searchable: true
      });
      var anchor = TestUtils.findRenderedDOMComponentWithClass(el, 'r-ss-magnifier');

      expect(anchor).toBeTruthy();
    });

    it('renders searchInput placeholer when prop is provided', function() {
      var el = renderAndOpen({
        searchable: true,
        searchPlaceholder: 'search placeholder'
      });

      expect(el._rssDOM.searchInput.getAttribute("placeholder")).toBe('search placeholder');
    });

    it('shows no results content when dataSource empty', function() {
      var el = renderAndOpen({
        dataSource: []
      });

      expect(el._rssDOM.noResults).toBeTruthy();
    });

    it('shows no results content with custom string when provided', function() {
      var el = renderAndOpen({
        noResultsString: 'blah',
        dataSource: []
      });

      expect(el._rssDOM.noResults.textContent).toBe('blah');
    });
  });

  describe('dropdown template content', function() {
    it('renders the default list item content when no template is provided', function() {
      var el = renderAndOpen();

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(mockData.length);
    });

    it('renders custom list item content when a mapper function is provided', function() {
      var el = renderComponent({
        customOptionTemplateFunction: function(option) {
          var text = option.name;
          return React.createElement("aside", {className: "custom-option"}, text);
        }
      });
      el.setState({
        isOpen: true
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el, 'custom-option');

      expect(optionElements.length).toBe(mockData.length);
    });

    it('custom template option function receives searchString as second param', function() {
      var el = renderAndOpen({
        customOptionTemplateFunction: jest.genMockFunction()
      });

      el.props.customOptionTemplateFunction.mockClear();

      el.setState({
        searchString: 'opt'
      });

      expect(el.props.customOptionTemplateFunction.mock.calls[0][1]).toBe(el.state.searchString);
    });
  });

  describe('search results filter', function() {
    it('filters the default option list by label', function() {
      var el = renderAndOpen();
      el.setState({
        searchString: 'two'
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(1);
    });

    it('filters by custom filter function and searchString', function() {
      var el = renderComponent({
        customFilterFunction: function(option, index, collection, searchTerm) {
          return (option.type === searchTerm);
        }
      });
      el.setState({
        isOpen: true,
        searchString: 'whatzit'
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(2);
    });

    it('does not render a clear search button when search is not set', function() {
      var el = renderAndOpen({
        searchable: true
      });
      el.setState({
        isOpen: true,
        searchString: ""
      });

      expect(el._rssDOM.searchClear).toBeUndefined();
    });

    it('renders a clear search button when search is set', function() {
      var el = renderAndOpen({
        searchable: true
      });

      el.setState({
        isOpen: true,
        searchString: 'whatzit'
      });

      expect(el._rssDOM.searchClear).toBeTruthy();
    });

    it('auto clears search on selection when clearSearchOnSelection is true', function() {
      var el = renderAndOpen({
        searchable: true,
        clearSearchOnSelection: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');


      el.setState({
        searchString: 'option'
      });

      TestUtils.Simulate.click(options[1]);

      expect(el.state.searchString).toBe("");
    });

    it('clears search value when clearSearch is clicked', function() {
      var el = renderAndOpen({
        searchable: true
      });

      el.setState({
        searchString: 'whatzit'
      });

      TestUtils.Simulate.click(el._rssDOM.searchClear);
      expect(el.state.searchString).toBe("");
    });

    it('clears search value when clearSearch is clicked', function() {
      var el = renderAndOpen({
        searchable: true
      });

      el.setState({
        searchString: 'whatzit'
      });

      TestUtils.Simulate.click(el._rssDOM.searchClear);
      expect(el.state.searchString).toBe("");
    });

    it('clears search value when clearSearch handles a keyDown event', function() {
      var el = renderAndOpen({
        searchable: true
      });

      el.setState({
        searchString: 'whatzit'
      });

      TestUtils.Simulate.keyDown(el._rssDOM.searchClear);
      expect(el.state.searchString).toBe("");
    });
  });

  describe('disabled option behavior', function() {
    it('can focus a disabled option', function() {
      var el = renderComponent({
        searchable: false,
        dataSource: mockDataWithDisabledOption
      });

      var focusSpy = spyOn(el, '_focusDOMOption').and.callThrough();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.down,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      focusSpy.calls.reset();

      TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
        which: el.keymap.down,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(1);
    });

    it('will not select disabled option on enter key', function() {
      var el = renderAndOpen({
        dataSource: mockDataWithDisabledOption
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      el._updateFocusedId(1);

      TestUtils.Simulate.keyDown(options[1], {
        which: el.keymap.enter
      });

      expect(el.state.value[0]).toBeUndefined();
    });

    it('will not select disabled option on click', function() {
      var el = renderAndOpen({
        dataSource: mockDataWithDisabledOption
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        shiftKey: true,
        currentTarget: {
          attributes: {
            'data-option-index': 1
          }
        }
      }, options[1].id);

      expect(el.state.value[0]).toBeUndefined();
    });

    it('does not select disabled options on shift-click multi-select operation', function() {
      var el = renderAndOpen({
        tags: true,
        dataSource: mockDataWithDisabledOption
      });

      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      TestUtils.Simulate.click(options[3], {
        metaKey: true,
        currentTarget: {
          attributes: {
            'data-option-index': 2
          }
        }
      }, options[3].id);

      TestUtils.Simulate.click(options[0], {
        shiftKey: true,
        currentTarget: {
          attributes: {
            'data-option-index': 0
          }
        }
      }, options[0].id);

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(3);
    });
  });

  describe('single item selection', function() {
    it('selects item by click', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.value[0]).toBe(mockData[1]);
    });

    it('deselects item by click when already selected', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.value[0]).toBe(mockData[1]);

      el.setState({
        isOpen: true
      });

      options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.value[0]).not.toBe(mockData[1]);
    });

    it('does not deselect item by click when already selected and deselectOnSelectedOptionClick is false', function() {
      var el = renderAndOpen({
        deselectOnSelectedOptionClick: false
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.value[0]).toBe(mockData[1]);

      el.setState({
        isOpen: true
      });

      options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.value[0]).toBe(mockData[1]);
    });

    it('will render with customSelectedValueTemplateFunction', function() {
      var templateMock = jest.genMockFunction(),
          el = renderAndOpen({
            customSelectedValueTemplateFunction: templateMock
          });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(templateMock.mock.calls[0][0]).toBe(el.state.value);
    });

    it('closes control after selection', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.isOpen).toBe(false);
    });

    it('does not close the control when keepOpenOnSelection true', function() {
      var el = renderAndOpen({
        keepOpenOnSelection: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
      expect(el.state.isOpen).toBe(true);
    });

    it('selects item by keyDown for enter', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      el._updateFocusedId(0);

      TestUtils.Simulate.keyDown(options[0], {
        which: el.keymap.enter
      });

      expect(el.state.value[0]).toBe(mockData[0]);
      expect(el.props.onChange.mock.calls[0][0]).toBe(mockData[0]);
    });

    it('selects item by keyDown for space bar', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      el._updateFocusedId(0);

      TestUtils.Simulate.keyDown(options[0], {
        which: el.keymap.space
      });

      expect(el.state.value[0]).toBe(mockData[0]);
      expect(el.props.onChange.mock.calls[0][0]).toBe(mockData[0]);
    });
  });

  describe('multiple item selection', function() {
    var getElWithThreeTags = function() {
          var el = renderAndOpen({
            tags: true
          });
          var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

          TestUtils.Simulate.click(options[1], {
            metaKey: true
          }, options[1].id);

          TestUtils.Simulate.click(options[3], {
            metaKey: true
          }, options[3].id);

          TestUtils.Simulate.click(options[4], {
            metaKey: true
          }, options[4].id);

          return el;
        };

    describe('remove buttons have focusability and keyboard enabled traversal', function() {
      it('moves focus from trigger to remove buttons', function() {
        var el = getElWithThreeTags(),
            removeButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');

        el.setState({
          isOpen: false
        });

        el._rssDOM.triggerDiv.focus();

        TestUtils.Simulate.keyDown(el._rssDOM.triggerDiv, {
          which: el.keymap.tab
        });

        expect(document.activeElement).toBe(removeButtons[0]);

        TestUtils.Simulate.keyDown(removeButtons[0], {
          which: el.keymap.tab
        });

        expect(document.activeElement).toBe(removeButtons[1]);

        TestUtils.Simulate.keyDown(removeButtons[1], {
          which: el.keymap.tab,
          shiftKey: true
        });

        expect(document.activeElement).toBe(removeButtons[0]);

        TestUtils.Simulate.keyDown(removeButtons[0], {
          which: el.keymap.tab,
          shiftKey: true
        });

        expect(document.activeElement).toBe(el._rssDOM.triggerDiv);
      });
    });

    it('selects multiple items by ctrl or meta-key click', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      TestUtils.Simulate.click(options[3], {
        metaKey: true
      }, options[3].id);

      expect(_.isEqual(el.state.value, [mockData[1], mockData[3]])).toBe(true);
      expect(_.isEqual(el.props.onChange.mock.calls[1][0], [mockData[1], mockData[3]])).toBe(true);
    });

    it('selects multiple items by ctrl or meta-key enter keypress', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      el._updateFocusedId(1);
      TestUtils.Simulate.keyDown(options[1], {
        metaKey: true,
        which: el.keymap.enter
      }, options[1].id);

      el._updateFocusedId(3);
      TestUtils.Simulate.keyDown(options[3], {
        metaKey: true,
        which: el.keymap.enter
      }, options[3].id);

      expect(_.isEqual(el.state.value, [mockData[1], mockData[3]])).toBe(true);
      expect(_.isEqual(el.props.onChange.mock.calls[1][0], [mockData[1], mockData[3]])).toBe(true);
    });

    it('deselects selected items by ctrl or meta-key enter keypress', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      el._updateFocusedId(1);
      TestUtils.Simulate.keyDown(options[1], {
        metaKey: true,
        which: el.keymap.enter
      }, options[1].id);

      el._updateFocusedId(3);
      TestUtils.Simulate.keyDown(options[3], {
        metaKey: true,
        which: el.keymap.enter
      }, options[3].id);

      el._updateFocusedId(1);
      TestUtils.Simulate.keyDown(options[1], {
        metaKey: true,
        which: el.keymap.enter,
        target: {
          getAttribute: function(key) {
            var attrs = {
              "data-option-value": options[1].id
            };
            return attrs[key];
          }
        }
      }, options[1].id);

      expect(_.isEqual(el.state.value, [mockData[3]])).toBe(true);
      expect(_.isEqual(el.props.onChange.mock.calls[2][0], [mockData[3]])).toBe(true);
    });

    it('does not deselect selected items if deselectOnSelectedOptionClick is false', function() {
      var el = renderAndOpen({
        multiple: true,
        deselectOnSelectedOptionClick: false
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      el._updateFocusedId(1);
      TestUtils.Simulate.keyDown(options[1], {
        metaKey: true,
        which: el.keymap.enter
      }, options[1].id);

      el._updateFocusedId(3);
      TestUtils.Simulate.keyDown(options[3], {
        metaKey: true,
        which: el.keymap.enter
      }, options[3].id);

      el._updateFocusedId(1);
      TestUtils.Simulate.keyDown(options[1], {
        metaKey: true,
        which: el.keymap.enter,
        target: {
          getAttribute: function(key) {
            var attrs = {
              "data-option-value": options[1].id
            };
            return attrs[key];
          }
        }
      }, options[1].id);

      expect(_.isEqual(el.state.value, [mockData[3]])).toBe(false);
      expect(el.props.onChange.mock.calls.length).toBe(2);
    });

    it('does not close a multiselect dropdown on a ctrl or meta-key enter keypress', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.keyDown(options[1], {
        metaKey: true,
        which: el.keymap.enter
      }, options[1].id);

      expect(el.state.isOpen).toBe(true);
    });

    it('does not close a multiselect dropdown on a ctrl or meta-key click', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      expect(el.state.isOpen).toBe(true);
    });

    it('deselects selected item on ctrl or meta click', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      expect(_.isEqual(el.state.value, [mockData[1]])).toBe(true);

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      expect(_.isEqual(el.state.value, [])).toBe(true);
    });

    it('will render multiple items as tags', function() {
      var el = getElWithThreeTags();

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(3);
      expect(el.state.value.length).toBe(3);
    });

    it('will delete tag when remove tag button is clicked', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      TestUtils.Simulate.click(removeTagButtons[0]);

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(2);
      expect(el.state.value.length).toBe(2);
    });

    it('will focus first available tag after tag removal by tag removal keypress on tag removal button', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      var tagFocusSpy = spyOn(el, '_setFocusToTagRemovalIfPresent');

      TestUtils.Simulate.keyDown(removeTagButtons[0], {
        which: el.keymap.enter,
        preventDefault: jest.genMockFunction(),
        stopPropagation: jest.genMockFunction()
      });

      expect(tagFocusSpy.calls.count()).toBe(1);
    });

    it('tag deletion works via enter key', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      TestUtils.Simulate.keyDown(removeTagButtons[0], {
        which: el.keymap.enter,
        preventDefault: jest.genMockFunction(),
        stopPropagation: jest.genMockFunction()
      });

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(2);
    });

    it('tag deletion works via space bar key', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      TestUtils.Simulate.keyDown(removeTagButtons[0], {
        which: el.keymap.space,
        preventDefault: jest.genMockFunction(),
        stopPropagation: jest.genMockFunction()
      });

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(2);
    });

    describe('shift up and down arrow selection', function() {
      it('selects focus item on keypress of shift-up arrow', function() {
        var el = renderAndOpen({
          multiple: true
        });
        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

        el._updateFocusedId(3);

        TestUtils.Simulate.keyDown(options[3], {
          shiftKey: true,
          which: el.keymap.up
        }, options[3].id);

        expect(_.isEqual(el.state.value, [mockData[3]])).toBe(true);
      });

      it('selects focus item on keypress of shift-down arrow', function() {
        var el = renderAndOpen({
          multiple: true
        });
        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

        el._updateFocusedId(3);

        TestUtils.Simulate.keyDown(options[3], {
          shiftKey: true,
          which: el.keymap.down
        }, options[3].id);

        expect(_.isEqual(el.state.value, [mockData[3]])).toBe(true);
      });
    });

    describe('shift-click multi-selection', function() {
      it('selects only the clicked option if non-multi select', function() {
        var el = renderAndOpen({});

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        TestUtils.Simulate.click(el._rssDOM.triggerDiv, {
          altKey: true,
          which: el.keymap.down
        });

        options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        el._updateFocusedId(3);

        TestUtils.Simulate.keyDown(options[3], {
          shiftKey: true,
          which: el.keymap.enter
        }, options[3].id);

        expect(el.state.value.length).toBe(1);
        expect(el.state.value[0]).toBe(mockData[3]);
      });

      it('selects multiple sequential options on shift-click in a up-list direction', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[3], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 2
            }
          }
        }, options[3].id);

        TestUtils.Simulate.click(options[0], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });

      it('deselects multiple sequential options up to but not including clicked option on shift-click in a up-list direction', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        TestUtils.Simulate.click(options[3], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 3
            }
          }
        }, options[3].id);

        TestUtils.Simulate.click(options[0], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(1);
        expect(_.isEqual(el.state.value, [mockData[0]])).toBe(true);
      });

      it('deselects multiple sequential options down to but not including clicked option on shift-click in a down-list direction', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

        TestUtils.Simulate.click(options[3], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 3
            }
          }
        }, options[3].id);

        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        TestUtils.Simulate.click(options[3], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 3
            }
          }
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(1);
        expect(_.isEqual(el.state.value, [mockData[3]])).toBe(true);
      });

      it('selects multiple sequential options on shift-click in a down-list direction', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        TestUtils.Simulate.click(options[3], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 2
            }
          }
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });

      it('selects multiple sequential options on shift-keypress of enter', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        el._updateFocusedId(3);

        TestUtils.Simulate.keyDown(options[3], {
          shiftKey: true,
          which: el.keymap.enter
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });

      it('selects multiple sequential options on shift-keypress of space bar', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        el._updateFocusedId(3);

        TestUtils.Simulate.keyDown(options[3], {
          shiftKey: true,
          which: el.keymap.space
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });
    });
  });

  describe('Custom Class Options', function() {
    it('renders with customClass when provided', function() {
      var el = renderAndOpen({
        customClass: 'yoClass'
      });

      expect(el._rssDOM.rssControl.getAttribute("class")).toMatch(/yoClass/);
    });

    it('renders tags with custom wrapper class when customTagClass provided', function() {
      var el = renderAndOpen({
        tags: true,
        customTagClass: 'yoTagClass'
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags[0].getAttribute("class")).toMatch(/yoTagClass/);
    });

    it('renders items in groups with customGroupHeadingClass', function() {
      var el = renderAndOpen({
        groupBy: 'type',
        customGroupHeadingClass: 'my-group'
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'my-group');

      expect(headings.length).toBe(3);
    });

    it('renders the user specified magnifier class if prop is set', function() {
      var el = renderAndOpen({
        searchable: true,
        'customSearchIconClass': 'boo-yahhhhhh'
      });

      var customAnchor = TestUtils.findRenderedDOMComponentWithClass(el, 'boo-yahhhhhh');

      expect(customAnchor).toBeTruthy();
    });

    // customLoaderClass prop is tested in block describe 'Populating data source from ajax'
  });

  describe('Populating data source from ajax', function() {
    var el,
        mockAjaxThen;

    beforeEach(function() {
      mockAjaxThen = jest.genMockFunction();
      el = renderComponent({
        ajaxErrorString: 'No Data For You!!!',
        dataSource: undefined,
        customLoaderClass: "loaditUp",
        ajaxDataFetch: jest.genMockFunction().mockReturnValue({
          then: mockAjaxThen
        })
      });
    });

    it('renders spinner when fetching ajax data', function() {
      el.toggleDropdown();

      expect(el._rssDOM.loader).toBeTruthy();
    });

    it('renders spinner with custom class', function() {
      el.toggleDropdown();

      expect(el._rssDOM.loader.getAttribute("class")).toMatch(/loaditUp/);
    });

    it('renders ajax data', function() {
      el.toggleDropdown();
      var promiseSuccessCallback = mockAjaxThen.mock.calls[0][0];
      promiseSuccessCallback(mockData);

      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      expect(el.state.ajaxError).toBe(false);
      expect(options.length).toBe(5);
    });

    it('renders error content on ajax errors', function() {
      el.toggleDropdown();
      var promiseErrorCallback = mockAjaxThen.mock.calls[0][1];
      promiseErrorCallback();

      expect(el.state.ajaxError).toBe(true);
      expect(el._rssDOM.errorDisplay).toBeTruthy();
      expect(el._rssDOM.errorDisplay.textContent).toBe('No Data For You!!!');
    });
  });

  describe('page Fetching functionality', function() {
    var el,
        hasMorePages = jest.genMockFunction(),
        mockAjaxThen,
        scrollNode;

    beforeEach(function() {
      mockAjaxThen = jest.genMockFunction();
      hasMorePages.mockClear();
      el = renderAndOpen({
        dataSource: undefined,
        hasMorePages: hasMorePages,
        pageDataFetch: jest.genMockFunction().mockReturnValue({
          then: mockAjaxThen
        })
      });
      scrollNode = el._rssDOM.scrollWrap;
      scrollNode.setAttribute("scrollHeight", 100);
      scrollNode.setAttribute("offsetHeight", 55);
      scrollNode.setAttribute("scrollTop", 50);
    });

    it('calls the pageDataFetch handler after scroll threshold is reached', function() {
      hasMorePages.mockReturnValue(true);
      TestUtils.Simulate.mouseMove(el._rssDOM.scrollWrap, {});

      expect(el.props.pageDataFetch.mock.calls.length).toBe(1);
    });

    it('renders a loader during pageDataFetch', function() {
      hasMorePages.mockReturnValue(true);
      TestUtils.Simulate.mouseMove(el._rssDOM.scrollWrap, {});

      expect(el._rssDOM.loader).toBeTruthy();
    });

    it('renders error content on ajax errors', function() {
      hasMorePages.mockReturnValue(true);
      TestUtils.Simulate.mouseMove(el._rssDOM.scrollWrap, {});

      var promiseErrorCallback = mockAjaxThen.mock.calls[0][1];
      promiseErrorCallback();

      expect(el.state.ajaxError).toBe(true);
      expect(el._rssDOM.errorDisplay).toBeTruthy();
      expect(el._rssDOM.errorDisplay.textContent).toBe(el.props.ajaxErrorString);
    });

    it('does not call the pageDataFetch handler if loader present', function() {
      hasMorePages.mockReturnValue(true);
      TestUtils.Simulate.mouseMove(el._rssDOM.scrollWrap, {});
      TestUtils.Simulate.mouseMove(el._rssDOM.scrollWrap, {});

      expect(el.props.pageDataFetch.mock.calls.length).toBe(1);
    });

    it('does not call the pageDataFetch handler if pageDataFetchingComplete', function() {
      hasMorePages.mockReturnValue(false);
      TestUtils.Simulate.mouseMove(el._rssDOM.scrollWrap, {});

      expect(el.props.pageDataFetch.mock.calls.length).toBe(0);
    });
  });

  describe('GroupBy Functionality', function() {
    it('renders items in groups when groupBy option is a string', function() {
      var el = renderAndOpen({
        groupBy: 'type'
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-option-group-heading');
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      expect(headings.length).toBe(3);
      expect(options.length).toBe(mockData.length);
    });

    it('renders items in groups when groupBy option is an object', function() {
      var el = renderAndOpen({
        groupBy: {'name': 'option three'}
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-option-group-heading');

      expect(headings.length).toBe(2);
    });

    it('renders items in groups when groupBy option is a function', function() {
      var el = renderAndOpen({
        groupBy: function(item) {
          return item.type !== 'whatzit';
        }
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-option-group-heading');

      expect(headings.length).toBe(2);
    });

    it('renders custom group heading content when group heading template function is provided', function() {
      var el = renderAndOpen({
        groupBy: 'type',
        customGroupHeadingTemplateFunction: function(option) {
          var text = option.type;
          return React.createElement("aside", {className: "custom-heading"}, text);
        }
      });

      var customHeadings = TestUtils.scryRenderedDOMComponentsWithClass(el, "custom-heading");

      expect(customHeadings.length).toBe(3);
    });
  });

  describe('_arrestScroll', function() {

    it('will stop Propagation of scroll down events in an open dropdown when scrollHeight is reached', function() {
      var el = renderAndOpen({});

      el._rssDOM.scrollWrap = {
        scrollTop: 0,
        clientHeight: 11,
        scrollHeight: 10
      };

      var arrestSpy = spyOn(el, '_arrestEvent').and.returnValue(undefined);

      el._arrestScroll({
        deltaY: 11
      });

      expect(arrestSpy).toHaveBeenCalled();
    });

    it('will not stop Propagation of scroll down events in an open dropdown when scrollHeight is not yet reached', function() {
      var el = renderAndOpen({});

      el._rssDOM.scrollWrap = {
        scrollTop: 0,
        clientHeight: 5,
        scrollHeight: 10
      };

      var arrestSpy = spyOn(el, '_arrestEvent').and.callFake(_.noop);

      el._arrestScroll({
        deltaY: 4
      });

      expect(arrestSpy).not.toHaveBeenCalled();
    });

    it('will stop Propagation of scroll up events in an open dropdown when top is reached', function() {
      var el = renderAndOpen({});

      el._rssDOM.scrollWrap = {
        scrollTop: 0,
        clientHeight: 11
      };

      var arrestSpy = spyOn(el, '_arrestEvent').and.returnValue(undefined);

      el._arrestScroll({
        deltaY: -1
      });

      expect(arrestSpy).toHaveBeenCalled();
    });

    it('will not stop Propagation of scroll events in an open dropdown when forceDefaultBrowserScrolling true', function() {
      var el = renderAndOpen({
        forceDefaultBrowserScrolling: true
      });

      var arrestSpy = spyOn(el, '_arrestEvent').and.returnValue(undefined);

      el._arrestScroll({});

      expect(arrestSpy).not.toHaveBeenCalled();
    });
  });

  describe('openOnMount prop', function() {
    it('will openOnMount', function() {
      var el = renderComponent({
        openOnMount: true
      });

      expect(el.state.isOpen).toBe(true);
    });
  });

  describe('componentWillReceiveProps', function() {
    let parent;

    beforeEach(function() {
      // parent = TestUtils.renderIntoDocument(React.createElement(TestHelperComponent));
      parent =TestUtils.renderIntoDocument(React.createElement(TestHelperComponent));
    });

    it('resets to new initial value on initial value prop change', function() {
      expect(parent.rss.props.initialValue).toBe(optOne);
      expect(_.isEqual(parent.rss.state.value, [optOne])).toBe(true);
      parent.setState({
        initialValue: optTwo
      });
      expect(_.isEqual(parent.rss.state.value, [optTwo])).toBe(true);
    });

    it('will update the optionLabel Key', function() {
      expect(parent.rss.state.labelKey).toBe("name");
      parent.setState({
        optionLabelKey: "foo"
      });
      expect(parent.rss.state.labelKey).toBe("foo");
    });

    it('will update the optionValue Key', function() {
      expect(parent.rss.state.valueKey).toBe("id");
      parent.setState({
        optionValueKey: "bar"
      });
      expect(parent.rss.state.valueKey).toBe("bar");
    });

    it('will update on dataSource change', function() {
      var lastData = parent.rss.state.data;
      parent.setState({
        dataSource: [optTwo]
      });
      expect(_.isEqual(parent.rss.state.data, lastData)).toBeFalsy();
      expect(_.isEqual(parent.rss.state.rawDataSource, [optTwo])).toBeTruthy();
      expect(parent.rss.state.lastOptionId).toBe(0);
    });

    it('will clear selected value dataSource change if clearSelectedValueOnDataSourceChange true', function() {
      parent.setState({
        clearSelectedValueOnDataSourceChange: true
      });
      parent.setState({
        dataSource: [optTwo]
      });
      expect(_.isEqual(parent.rss.state.value, [])).toBe(true);
    });
  });
});
