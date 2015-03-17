"use strict";

var _ = require("lodash"),
    classNames = require("classnames"),
    React = require("react");

// test data call
// http://tumblr.tastefullyoffensive.com/api/read/json?filter=text&type=text

var ReactSuperSelect = React.createClass({
  displayName: "ReactSuperSelect",

  propTypes: {
    placeholder: React.PropTypes.string,
    searchPlaceholder: React.PropTypes.string,
    noResultsString: React.PropTypes.string,
    onChange: React.PropTypes.func,
    externalSearchIconClass: React.PropTypes.string,
    searchable: React.PropTypes.bool,

    remoteDataSourceFetchFunction: React.PropTypes.object,
    remoteDataSourceIsMultiPage: React.PropTypes.bool,

    dataSource: React.PropTypes.arrayOf(React.PropTypes.object),

    // simple option element props for hidden select
    optionValueKey: React.PropTypes.string,
    optionLabelKey: React.PropTypes.string,
    customFilterFunction: React.PropTypes.func,
    // custom mapping function
    customOptionsMapper: React.PropTypes.func,

    isMultiSelect: React.PropTypes.bool,
    optionTemplate: React.PropTypes.object },

  // do not use state because we do not want re-render when focusing
  focusedId: undefined,
  lastOptionId: undefined,

  getInitialState: function getInitialState() {
    return {
      isOpen: false,
      searchString: undefined,
      value: undefined
    };
  },

  keymap: {
    down: 40,
    end: 35, // goto last option ?
    enter: 13,
    esc: 27,
    home: 36, // go to first option ?
    left: 37,
    right: 39,
    space: 32,
    tab: 9,
    up: 38
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // need to update focus tracking if dataSource changes
    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)) {
      var data = nextProps.dataSource || [];
      this.lastOptionId = data.length > 0 ? data.length - 1 : undefined;
      this.focusedId = undefined;
    }
  },

  _closedOnKeypress: function _closedOnKeypress() {
    if (this.state.isOpen) {
      this.toggleDropdown();
      this._focusTrigger();
      return true;
    }
    return false;
  },

  _defaultSearchFilter: function _defaultSearchFilter(option) {
    var search = this.state.searchString.toLowerCase();
    if (!_.isString(option.name)) {
      return false;
    }
    return option.name.toLowerCase().indexOf(search) > -1;
  },

  _filterDataBySearchString: function _filterDataBySearchString(data) {
    var filterFunction = _.isFunction(this.props.customFilterFunction) ? this.props.customFilterFunction : this._defaultSearchFilter;
    return _.filter(data, filterFunction);
  },

  _getDataSource: function _getDataSource() {
    var data = this.props.dataSource || [];
    if (_.isString(this.state.searchString)) {
      data = this._filterDataBySearchString(data);
    }
    return data;
  },

  _getDropdownContent: function _getDropdownContent() {
    if (!this.state.isOpen) {
      return null;
    }

    var searchContent = this._getSearchContent(),
        optionContent = this._getOptionsMarkup();
    return React.createElement(
      "div",
      { ref: "dropdownContent", className: "r-ss-dropdown", onKeyUp: this._handleKeyUp },
      searchContent,
      React.createElement(
        "div",
        { className: "r-ss-options-wrap" },
        React.createElement(
          "ul",
          { className: "r-ss-dropdown-options", ref: "dropdownOptionsList", "aria-hidden": !this.state.isOpen, role: "menubar" },
          optionContent
        )
      )
    );
  },

  _getHiddenSelectElement: function _getHiddenSelectElement() {
    var optionsMarkup = this._mapDataToHiddenSelectOptions();

    return React.createElement(
      "select",
      { ref: "hiddenSelect", className: "r-ss-hidden", onChange: this.props.onChange },
      optionsMarkup
    );
  },

  _getOptionsMarkup: function _getOptionsMarkup() {
    var options = _.isFunction(this.props.customOptionsMapper) ? this._mapDataToCustomOptionMarkup() : this._mapDataToDefaultOptionMarkup();
    return options;
  },

  _getSearchContent: function _getSearchContent() {
    if (!this.props.searchable) {
      return null;
    }

    var magnifierClass = this.props.externalSearchIconClass ? this.props.externalSearchIconClass : "r-ss-magnifier";

    return React.createElement(
      "div",
      { className: "r-ss-search-wrap" },
      React.createElement(
        "div",
        { className: "r-ss-search-inner" },
        React.createElement("input", { ref: "searchInput", placeholder: this.props.searchPlaceholder, onKeyUp: this._handleSearch, defaultValue: this.state.searchString }),
        React.createElement(
          "i",
          { className: magnifierClass },
          "search"
        )
      )
    );
  },

  _handleKeyUp: function _handleKeyUp(event) {
    event.preventDefault();
    event.stopPropagation();
    switch (event.which) {
      case this.keymap.down:
        this._onDownKey();
        break;
      case this.keymap.enter:
        this._onEnterKey();
        break;
      case this.keymap.esc:
        this._onEscKey();
        break;
      case this.keymap.left:
        // delegate to up handler
        this._onUpKey();
        break;
      case this.keymap.right:
        // delegate to down handler
        this._onDownKey();
        break;
      case this.keymap.space:
        this._onSpaceKey();
        break;
      case this.keymap.up:
        this._onUpKey();
        break;
    }
  },

  _handleSearch: function _handleSearch(event) {
    var searchString = event.target.value;
    this._handleSearchDebounced.call(this, searchString);
    // need to get keyup events to top level of control DOM
    this._handleKeyUp(event);
  },

  _handleSearchDebounced: _.debounce(function (search) {
    this.setState({
      searchString: search
    });
  }, 300),

  _mapDataToCustomOptionMarkup: function _mapDataToCustomOptionMarkup() {
    var valueKey = this.props.optionValueKey || "id",
        data = this._getDataSource(),
        self = this;

    return _.map(data, function (dataOption, index) {
      var itemKey = "drop_li_" + dataOption[valueKey],
          indexRef = "option_" + index,
          customOptionMarkup = self.props.customOptionsMapper(dataOption);
      return React.createElement(
        "li",
        { ref: indexRef, tabIndex: "0", className: "r-ss-dropdown-option", key: itemKey, "data-option-value": dataOption[valueKey], onClick: self._selectItem, role: "menuitem" },
        customOptionMarkup
      );
    });
  },

  _mapDataToDefaultOptionMarkup: function _mapDataToDefaultOptionMarkup() {
    var labelKey = this.props.optionLabelKey || "name",
        valueKey = this.props.optionValueKey || "id",
        data = this._getDataSource(),
        self = this;

    return _.map(data, function (dataOption, index) {
      //TODO stream icons, template-capable select control needed
      var itemKey = "drop_li_" + dataOption[valueKey],
          indexRef = "option_" + index;
      return React.createElement(
        "li",
        { ref: indexRef, tabIndex: "0", className: "r-ss-dropdown-option", key: itemKey, "data-option-value": dataOption[valueKey], onClick: self._selectItem, role: "menuitem" },
        dataOption[labelKey]
      );
    });
  },

  _mapDataToHiddenSelectOptions: function _mapDataToHiddenSelectOptions() {
    var labelKey = this.props.optionLabelKey || "name",
        valueKey = this.props.optionValueKey || "id",
        data = this.props.dataSource || [];

    return _.map(data, function (dataOption) {
      //TODO stream icons, template-capable select control needed
      return React.createElement(
        "option",
        { key: dataOption[valueKey], value: dataOption[valueKey] },
        dataOption[labelKey]
      );
    });
  },

  /* FOCUS Logic */
  _moveFocusDown: function _moveFocusDown() {
    var nextId;
    if (_.isUndefined(this.focusedId)) {
      if (this.props.searchable) {
        nextId = -1;
      } else {
        nextId = 0;
      }
    } else {
      nextId = this.lastOptionId === this.focusedId ? this.lastOptionId : this.focusedId + 1;
    }
    this._updateFocusedId(nextId);
  },

  _moveFocusUp: function _moveFocusUp() {
    var previousId;

    if (!_.isUndefined(this.focusedId) && this.focusedId !== -1) {
      if (this.focusedId === 0) {
        if (this.props.searchable) {
          previousId = -1;
        }
      } else {
        previousId = this.focusedId - 1;
      }
    }
    this._updateFocusedId(previousId);
  },

  _focusDOMOption: function _focusDOMOption() {
    var optionRef = "option_" + this.focusedId;
    if (this.refs[optionRef]) {
      this.refs[optionRef].getDOMNode().focus();
    }
  },

  _focusSearch: function _focusSearch() {
    if (this.refs.searchInput) {
      this.refs.searchInput.getDOMNode().focus();
    }
  },

  _focusTrigger: function _focusTrigger() {
    if (this.refs.triggerAnchor) {
      this.refs.triggerAnchor.getDOMNode().focus();
    }
  },

  _updateFocusedId: function _updateFocusedId(id) {
    this.focusedId = id;
    if (_.isUndefined(id)) {
      this._closedOnKeypress();
      return;
    }

    if (id < 0) {
      this._focusSearch();
      return;
    }

    this._focusDOMOption();
  },

  /* END FOCUS Logic */

  _onDownKey: function _onDownKey() {
    if (!this._openedOnKeypress()) {
      // move through selections if not just opening
      this._moveFocusDown();
    }
  },

  _onEnterKey: function _onEnterKey() {
    if (!this._openedOnKeypress()) {
      // select current if already open
      console.log("pressin enter!");
    }
  },

  _onEscKey: function _onEscKey() {
    this._closedOnKeypress();
  },

  _onSpaceKey: function _onSpaceKey() {
    this._openedOnKeypress();
  },

  _onUpKey: function _onUpKey() {
    // TODO - close if on first option
    // otherwise select previous
    this._moveFocusUp();
  },

  _openedOnKeypress: function _openedOnKeypress() {
    if (!this.state.isOpen) {
      this.toggleDropdown();
      return true;
    }
    return false;
  },

  _selectItem: function _selectItem(event) {
    debugger;
  },

  toggleDropdown: function toggleDropdown() {
    this.setState({
      isOpen: !this.state.isOpen
    }, function () {
      if (this.state.isOpen) {
        this._moveFocusDown();
      }
    });
  },

  render: function render() {
    var hiddenSelect = this._getHiddenSelectElement(),
        dropdownContent = this._getDropdownContent(),
        valueDisplayClass,
        triggerDisplayContent,
        triggerClasses,
        caratClass = classNames("carat", {
      down: !this.state.isOpen,
      up: this.state.isOpen
    });
    triggerClasses = classNames("r-ss-trigger", {
      "r-ss-open": this.state.isOpen
    });
    triggerDisplayContent = this.state.value ? this.state.value : this.props.placeholder;
    valueDisplayClass = classNames("r-ss-value-display", {
      "r-ss-placeholder": !this.state.value });

    return React.createElement(
      "div",
      { className: "r-ss-wrap" },
      React.createElement(
        "div",
        { ref: "triggerDiv", className: triggerClasses, onClick: this.toggleDropdown, onKeyUp: this._handleKeyUp, "aria-haspopup": "true" },
        React.createElement(
          "a",
          { ref: "triggerAnchor", className: "r-ss-mock-input", tabIndex: "0", "aria-label": this.props.placeholder },
          React.createElement(
            "span",
            { className: valueDisplayClass, ref: "valueDisplay" },
            triggerDisplayContent
          ),
          React.createElement(
            "span",
            { ref: "carat", className: caratClass },
            " "
          )
        )
      ),
      hiddenSelect,
      dropdownContent
    );
  }

});

module.exports = ReactSuperSelect;