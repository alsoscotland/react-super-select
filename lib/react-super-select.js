'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // © Scotland Stephenson 2015-2016

// - [github](https://github.com/alsoscotland/react-super-select)
// - [documentation](http://alsoscotland.github.io/react-super-select/)
// - freely distributed under the MIT license.

// Dependencies
//  - [Lodash](https://lodash.com/)
//  - [classnames](https://www.npmjs.com/package/classnames)
//  - [React](https://facebook.github.io/react/index.html)


// PROPS and DEFAULT PROPS are declared at Bottom of File

var _ref = _react2.default.createElement('span', null);

var _ref2 = _react2.default.createElement('span', null);

var _ref3 = _react2.default.createElement('span', null);

var ReactSuperSelect = function (_React$Component) {
  _inherits(ReactSuperSelect, _React$Component);

  function ReactSuperSelect(props) {
    _classCallCheck(this, ReactSuperSelect);

    // CONSTANTS
    // ---------

    // used as the focusedId state variable value, when the search input field of a **searchable** control has focus.

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactSuperSelect).call(this, props));

    this.props = props;

    _this.SEARCH_FOCUS_ID = -1;

    // regular expression used to determine if event src options have selected class
    _this.SELECTED_OPTION_REGEX = /r-ss-selected/;

    // KEYMAP CONSTANT
    // ------
    // A text-based lookup for keyboard navigation keys and their corresponding 'which' keycode values
    _this.keymap = {
      down: 40,
      end: 35, // goto last option ?
      enter: 13,
      esc: 27,
      home: 36, // go to first option ?
      space: 32,
      tab: 9,
      up: 38
    };

    _this.ariaRelevantKeydownCodes = _lodash2.default.values(_this.keymap);

    // NON-STATE VARS (no need to re-render based on these being set)

    // **lastUserSelectedOptionData** - A store of the last user-selected option, used for accesibility-related option focusing, as well as shift-click selection
    _this.lastUserSelectedOption = undefined;

    // store object for internal DOM refs
    _this._rssDOM = {};

    // STATE VARIABLES
    // ---------------
    _this.state = {
      // **ajaxError** (Boolean) - Set to true when an ajax request fails
      ajaxError: false,

      // **controlId** (String) - A unique identifier for the rss control. This value is used to generate aria accessibility labels
      controlId: _this.props.controlId || _lodash2.default.uniqueId('rss_'),

      // **data** (Array of Objects) the active dataSource collection used to map to option elements, with any search filtering results reflected
      data: _this._configureDataSource(_this.props.dataSource),

      // **rawDataSource** (Object|Array) The raw dataSource value the user supplies through the *dataSource* prop (or returned from *ajaxDataFetch* / *pageDataFetch*). This value is passed to the *pageDataFetch* callback
      rawDataSource: _this.props.dataSource,

      // **isOpen** (Boolean) - Whether or not the dropdown is open
      isOpen: false,

      // **focusedId** (Number) - Used to track keyboard focus for accessibility
      focusedId: undefined,

      // **labelKey** (String) - The option object key that will be used to identify the value displayed as an option's label
      labelKey: _this.props.optionLabelKey,

      // **lastOptionId** (Number) - Used in keyboard navigation to focus the last available option in the dropdown
      lastOptionId: _lodash2.default.isArray(_this.props.dataSource) && _this.props.dataSource.length > 0 ? _this.props.dataSource.length - 1 : undefined,

      // **searchString** (String) - When the **searchable** option is true, this is the user-entered value in the search field. It is used for data filtering based on the label key's value
      searchString: "",

      // **value** (Array) - An array that holds the current user-selected option(s)
      value: _this._buildInitialValue(),

      // **valueKey** (String) - The option object key that will be used to identify the value used as an option's value property (values must be unique across data source)
      valueKey: _this.props.optionValueKey
    };

    // force control instance context in all internal class functions
    _lodash2.default.bindAll(_this, ['toggleDropdown', '_ariaGetActiveDescendentId', '_ariaGetListId', '_arrestScroll', '_broadcastChange', '_buildInitialValue', '_clearSearchString', '_clearSelection', '_closeOnKeypress', '_configureDataSource', '_defaultSearchFilter', '_fetchDataViaAjax', '_fetchNextPage', '_filterDataBySearchString', '_findArrayOfOptionDataObjectsByValue', '_focusCurrentFocusedId', '_focusDOMOption', '_focusRemovalButtons', '_focusTrigger', '_generateValueDisplay', '_getAjaxErrorMarkup', '_getDataSource', '_getDropdownContent', '_getFocusedOptionKey', '_getGroupHeadingMarkup', '_getNoResultsMarkup', '_getNormalDisplayMarkup', '_getLoadingMarkup', '_getOptionIndexFromTarget', '_getOptionsMarkup', '_getOptionValueFromDataAttr', '_getPagingLi', '_getSearchContent', '_getTagsDisplayMarkup', '_getTagMarkup', '_getTagRemoveIndex', '_getTemplatedOptions', '_handleDocumentClick', '_handleKeyDown', '_handleSearch', '_isCurrentlySelected', '_isMultiSelect', '_isUserSearchTypingEvent', '_mapDataToOptionsMarkup', '_moveFocusDown', '_moveFocusUp', '_needsAjaxFetch', '_onDownKey', '_onEndKey', '_onEnterKey', '_onEscKey', '_onHomeKey', '_onMouseMove', '_onUpKey', '_pageFetchingComplete', '_removeAllOptionsInOptionIdRange', '_removeSelectedOptionByValue', '_removeTagKeyPress', '_removeTagClick', '_selectAllOptionsInOptionIdRange', '_selectAllOptionsToLastUserSelectedOption', '_selectFocusedOption', '_selectItemByValues', '_selectItemOnOptionClick', '_setFocusIdToSearch', '_setFocusOnOpen', '_setFocusToTagRemovalIfPresent', '_updateFocusedId']);

    return _this;
  }

  // wire document click close control handler


  _createClass(ReactSuperSelect, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.disabled) {
        return;
      }
      document.addEventListener('click', this._handleDocumentClick);
      document.addEventListener('touchstart', this._handleDocumentClick);

      if (this.props.openOnMount) {
        this.setState({
          isOpen: true
        }, function () {
          if (_this2.props.focusOnMount && !_lodash2.default.isFunction(_this2.props.ajaxDataFetch)) {
            _this2._moveFocusDown();
          }
        });
      }
    }

    // remove binding for document click close control handler

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('click', this._handleDocumentClick);
      document.removeEventListener('touchstart', this._handleDocumentClick);
    }

    // If parent page updates the data source, reset all control state values which are derived from props.
    // Reset some state defaults and dataSource related fields if dataSource changed.

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var newState = {};

      if (!_lodash2.default.isEqual(nextProps.initialValue, this.props.initialValue)) {
        newState.value = this._buildInitialValue(nextProps);
      }

      if (!_lodash2.default.isUndefined(nextProps.optionLabelKey) && nextProps.optionLabelKey !== this.props.optionLabelKey) {
        newState.labelKey = nextProps.optionLabelKey;
      }

      if (!_lodash2.default.isUndefined(nextProps.optionValueKey) && nextProps.optionValueKey !== this.props.optionValueKey) {
        newState.valueKey = nextProps.optionValueKey;
      }

      if (!_lodash2.default.isEqual(this.props.dataSource, nextProps.dataSource)) {

        this.lastUserSelectedOption = undefined;

        newState = _lodash2.default.extend(newState, {
          data: this._configureDataSource(nextProps.dataSource),
          rawDataSource: nextProps.dataSource,
          focusedId: undefined,
          lastOptionId: _lodash2.default.isArray(nextProps.dataSource) && nextProps.dataSource.length > 0 ? nextProps.dataSource.length - 1 : undefined
        });
      }

      if (!_lodash2.default.isEmpty(newState)) {
        this.setState(newState);
      }
    }

    // Update focused element after re-render

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this._focusCurrentFocusedId();

      if (this.state.isOpen !== prevState.isOpen) {
        var openStateCallback = this.state.isOpen ? this.props.onOpenDropdown : this.props.onCloseDropdown;
        openStateCallback();
      }
    }

    // main render method

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var caratClass = (0, _classnames2.default)('carat', {
        'down': !this.state.isOpen,
        'up': this.state.isOpen
      }),
          clearSelectionButton = null,
          clearSelectionLabelString = this.props.clearSelectionLabelString ? this.props.clearSelectionLabelString : this.props.clearSelectionLabelString,
          dropdownContent = this._getDropdownContent(),
          placeholderString = void 0,
          triggerClasses = void 0,
          triggerDisplayContent = void 0,
          wrapClasses = void 0;

      wrapClasses = (0, _classnames2.default)("r-ss-wrap", this.props.customClass, {
        'r-ss-expanded': this.state.isOpen
      });

      triggerClasses = (0, _classnames2.default)('r-ss-trigger', {
        'r-ss-open': this.state.isOpen,
        'r-ss-disabled': this.props.disabled,
        'r-ss-placeholder': this.state.value.length < 1
      });

      placeholderString = this.props.placeholder ? this.props.placeholder : this.props.placeholder;
      triggerDisplayContent = this.state.value.length ? this._generateValueDisplay() : placeholderString;

      if (!_lodash2.default.isEmpty(this.state.value) && this.props.clearable !== false) {
        clearSelectionButton = _react2.default.createElement(
          'button',
          { 'aria-label': clearSelectionLabelString, ref: function ref(c) {
              _this3._rssDOM.selectionClear = c;
            }, name: 'clearSelection', type: 'button', className: 'r-ss-selection-clear', onClick: this._clearSelection, onKeyDown: this._clearSelection },
          _ref
        );
      }

      return _react2.default.createElement(
        'div',
        { ref: function ref(c) {
            _this3._rssDOM.rssControl = c;
          }, id: this.state.controlId, className: wrapClasses },
        _react2.default.createElement(
          'div',
          { ref: function ref(c) {
              _this3._rssDOM.triggerDiv = c;
            },
            className: triggerClasses,
            onClick: this.toggleDropdown,
            onKeyDown: this._handleKeyDown,
            role: 'combobox',
            'aria-activedescendant': this._ariaGetActiveDescendentId(),
            'aria-disabled': this.props.disabled,
            'aria-haspopup': true,
            'aria-controls': this._ariaGetListId(),
            'aria-label': placeholderString,
            'aria-multiselectable': this._isMultiSelect(),
            tabIndex: '0' },
          triggerDisplayContent,
          clearSelectionButton,
          _react2.default.createElement(
            'span',
            { ref: function ref(c) {
                _this3._rssDOM.carat = c;
              }, className: caratClass },
            ' '
          )
        ),
        dropdownContent
      );
    }

    // toggles the open-state of the dropdown
    // sets focused option in callback after opening

  }, {
    key: 'toggleDropdown',
    value: function toggleDropdown() {
      var _this4 = this;

      if (this.props.disabled) {
        return;
      }

      var newState = {
        isOpen: !this.state.isOpen
      };

      if (this.state.isOpen) {
        _lodash2.default.extend(newState, {
          focusedId: undefined
        });
      }

      var wasClosed = !this.state.isOpen;

      this.setState(newState, function () {
        if (wasClosed) {
          _this4._setFocusOnOpen();
        }
      });
    }

    // returns the unique DOM id for the currently focused option. Used for accessibility-related labeling

  }, {
    key: '_ariaGetActiveDescendentId',
    value: function _ariaGetActiveDescendentId() {
      var ariaActiveDescendantId = null;
      var optionRef = this._getFocusedOptionKey();
      if (this._rssDOM[optionRef]) {
        ariaActiveDescendantId = this._rssDOM[optionRef].id;
      }
      return ariaActiveDescendantId;
    }

    // calculate the unique identifier for the options ul for aria compliance labeling usage

  }, {
    key: '_ariaGetListId',
    value: function _ariaGetListId() {
      return this.state.controlId + '_list';
    }

    // helper for stopping event propagation

  }, {
    key: '_arrestEvent',
    value: function _arrestEvent(event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // stop wheel events in dropdown from scrolling page

  }, {
    key: '_arrestScroll',
    value: function _arrestScroll(event) {
      if (this.props.forceDefaultBrowserScrolling) {
        return true;
      }

      var arrestScroll = false;
      var adjustedHeight = this._rssDOM.scrollWrap.scrollTop + this._rssDOM.scrollWrap.clientHeight;

      if (event.deltaY > 0) {
        if (adjustedHeight >= this._rssDOM.scrollWrap.scrollHeight) {
          arrestScroll = true;
        }
      } else if (this._rssDOM.scrollWrap.scrollTop <= 0) {
        arrestScroll = true;
      }

      if (arrestScroll) {
        this._arrestEvent(event);
      }
    }

    // call onChange handler with updated value
    // should be called as setState callback when changing state.value
    // will call with undefined when no values are set

  }, {
    key: '_broadcastChange',
    value: function _broadcastChange() {
      var outputValue = this._isMultiSelect() ? this.state.value : _lodash2.default.head(this.state.value);
      outputValue = _lodash2.default.isEmpty(outputValue) ? undefined : outputValue;
      this.props.onChange(outputValue);
    }

    // calculate the initial value for the control from props, componentWillReceiveProps will call passing nextProps

  }, {
    key: '_buildInitialValue',
    value: function _buildInitialValue(props) {
      props = props || this.props;
      var initialValue = [];

      if (!_lodash2.default.isUndefined(props.initialValue)) {
        initialValue = _lodash2.default.isArray(props.initialValue) ? props.initialValue : [props.initialValue];

        if (!this._isMultiSelect()) {
          initialValue = [_lodash2.default.head(initialValue)];
        }
      }

      return initialValue;
    }

    // clear the searchString value
    // for **searchable** controls

  }, {
    key: '_clearSearchString',
    value: function _clearSearchString() {
      this.setState({
        searchString: ""
      }, this._setFocusIdToSearch);
    }

    // clear the selected options
    // for **clearable** controls

  }, {
    key: '_clearSelection',
    value: function _clearSelection(event) {
      var _this5 = this;

      if (event.which === this.keymap.enter || event.which === this.keymap.space || event.type === "click") {
        event.stopPropagation();
        this.setState({
          value: []
        }, function () {
          if (_this5.state.isOpen) {
            _this5._setFocusOnOpen();
          }
          _this5.lastUserSelectedOption = undefined;
          _this5._focusTrigger();
          _this5._broadcastChange();
        });
      }
    }

    // close the dropdown
    // resets focus to the main control trigger
    // clear focused id

  }, {
    key: '_closeOnKeypress',
    value: function _closeOnKeypress() {
      if (this.state.isOpen) {
        this.setState({
          isOpen: false,
          focusedId: undefined
        }, this._focusTrigger);
      }
    }

    // overloaded dataSource parser (Object|Array)
    // case: (object) - look for a collection property which is an array, or runs an existing 'get' function, get('collection'), and determines if the return value is an array
    // case: (Array) - return the dataSource array for use as this.state.data

  }, {
    key: '_configureDataSource',
    value: function _configureDataSource(dataSource) {
      if (_lodash2.default.isArray(dataSource)) {
        return dataSource;
      }

      if (_lodash2.default.isObject(dataSource)) {
        if (_lodash2.default.isArray(dataSource.collection)) {
          return dataSource.collection;
        }

        if (_lodash2.default.isFunction(dataSource.get)) {
          var collection = dataSource.get('collection');
          if (_lodash2.default.isArray(collection)) {
            return collection;
          }
        }
      }

      return [];
    }

    // Used if no **customFilterFunction** provided for filtering the data options shown in a **searchable** control.
    // Runs a lowercase string comparison with the **searchString** and the value corresponding to an option's **optionLabelKey**

  }, {
    key: '_defaultSearchFilter',
    value: function _defaultSearchFilter(option) {
      var search = this.state.searchString.toLowerCase();
      if (!_lodash2.default.isString(option[this.state.labelKey])) {
        return false;
      }
      return option[this.state.labelKey].toLowerCase().indexOf(search) > -1;
    }

    // fetch data source via ajax if **ajaxDataFetch** function provided
    // handles success and failure for ajax call

  }, {
    key: '_fetchDataViaAjax',
    value: function _fetchDataViaAjax() {
      var self = this;
      this.props.ajaxDataFetch(this.state.rawDataSource).then(function (dataSourceFromAjax) {
        self.setState({
          ajaxError: false,
          data: self._configureDataSource(dataSourceFromAjax),
          rawDataSource: dataSourceFromAjax
        }, function () {
          if (self.props.openOnMount && self.props.focusOnMount) {
            self._moveFocusDown();
          }
        });
      }, function () {
        self.setState({
          ajaxError: true,
          // define as empty array on error so that _needsAjaxFetch will evaluate to false
          rawDataSource: []
        });
      });
    }

    // Fetch the next page of options data if **pageDataFetch** function provided.
    // Called onMouseMove if scroll position in dropdown exceeds threshold.
    // Handles success and failure for ajax call

  }, {
    key: '_fetchNextPage',
    value: function _fetchNextPage() {
      var self = this;
      this.props.pageDataFetch(this.state.rawDataSource).then(function (dataSourceFromPageFetch) {
        self.setState({
          ajaxError: false,
          data: self._configureDataSource(dataSourceFromPageFetch),
          rawDataSource: dataSourceFromPageFetch,
          isFetchingPage: false
        });
      }, function () {
        self.setState({
          ajaxError: true
        });
      });
    }

    // choose the appropriate search filter function and run the filter against the options data

  }, {
    key: '_filterDataBySearchString',
    value: function _filterDataBySearchString(data) {
      var self = this;

      var filterFunction = this._defaultSearchFilter;
      if (_lodash2.default.isFunction(this.props.customFilterFunction)) {
        filterFunction = function filterFunction(value, index, collection) {
          return self.props.customFilterFunction.apply(self, [value, index, collection, self.state.searchString.toLowerCase()]);
        };
      }
      return _lodash2.default.filter(data, filterFunction);
    }

    // used when selecting values, returns an array of full option-data objects which contain any single value, or any one of an array of values passed in

  }, {
    key: '_findArrayOfOptionDataObjectsByValue',
    value: function _findArrayOfOptionDataObjectsByValue(value) {
      var _this6 = this;

      var valuesArray = _lodash2.default.isArray(value) ? _lodash2.default.map(value, this.state.valueKey) : [value];
      return _lodash2.default.reject(this.state.data, function (item) {
        return !_lodash2.default.includes(valuesArray, item[_this6.state.valueKey]);
      });
    }

    // determine whether to focus a option value in the DOM, or the search field

  }, {
    key: '_focusCurrentFocusedId',
    value: function _focusCurrentFocusedId() {
      if (this.state.focusedId < 0) {
        this._focusSearch();
        return;
      }

      this._focusDOMOption();
    }

    // focus the DOM option identified by the current state.focusedId

  }, {
    key: '_focusDOMOption',
    value: function _focusDOMOption() {
      var optionRef = this._getFocusedOptionKey();
      if (this._rssDOM[optionRef]) {
        if (_lodash2.default.isFunction(this._rssDOM[optionRef].focus)) {
          this._rssDOM[optionRef].focus();
        }
      }
    }

    // focus the dropdown's search field if it exists

  }, {
    key: '_focusSearch',
    value: function _focusSearch() {
      if (this._rssDOM.searchInput) {
        this._rssDOM.searchInput.focus();
      }
    }

    // shift focus from dropdown trigger to any removal/clear buttons
    // for keyboard navigation and accessibility

  }, {
    key: '_focusRemovalButtons',
    value: function _focusRemovalButtons(event) {
      var triggerContainer = this._rssDOM.triggerDiv;

      var buttons = triggerContainer.getElementsByTagName('button');

      var currentlyFocusedRemoveButtonIndex = void 0,
          nextButtonIndexToFocus = void 0;

      if (buttons.length) {
        for (var i = 0; i < buttons.length; i++) {
          if (buttons[i] === document.activeElement) {
            currentlyFocusedRemoveButtonIndex = i;
            nextButtonIndexToFocus = event.shiftKey ? i - 1 : i + 1;
          }
        }
      }

      if (buttons[nextButtonIndexToFocus]) {
        this._arrestEvent(event);
        buttons[nextButtonIndexToFocus].focus();
      } else if (nextButtonIndexToFocus && nextButtonIndexToFocus < 0) {
        this._focusTrigger();
      } else if (buttons[0] && !_lodash2.default.isNumber(currentlyFocusedRemoveButtonIndex)) {
        this._arrestEvent(event);
        buttons[0].focus();
      }
    }

    // focus the main trigger element of the control if the user is interacting with this control instance

  }, {
    key: '_focusTrigger',
    value: function _focusTrigger() {
      this._rssDOM.triggerDiv.focus();
    }

    // choose whether to template the display of user-selected values normally, or as tags

  }, {
    key: '_generateValueDisplay',
    value: function _generateValueDisplay() {
      if (this.props.customSelectedValueTemplateFunction) {
        return this.props.customSelectedValueTemplateFunction(this.state.value);
      }

      if (!this.props.tags) {
        return this._getNormalDisplayMarkup();
      }
      return this._getTagsDisplayMarkup();
    }

    // render the content shown if an ajax error occurs

  }, {
    key: '_getAjaxErrorMarkup',
    value: function _getAjaxErrorMarkup() {
      var _this7 = this;

      var errorString = this.props.ajaxErrorString ? this.props.ajaxErrorString : this.ajaxErrorString;
      return _react2.default.createElement(
        'li',
        { className: 'r-ss-dropdown-option error' },
        _react2.default.createElement(
          'i',
          { ref: function ref(c) {
              _this7._rssDOM.errorDisplay = c;
            } },
          errorString
        )
      );
    }

    // calculate and return the renderable data source object or array, factoring in the search filtering, and any grouping functionality

  }, {
    key: '_getDataSource',
    value: function _getDataSource() {
      var data = _lodash2.default.isArray(this.state.data) ? this.state.data : [];
      if (_lodash2.default.isString(this.state.searchString)) {
        data = this._filterDataBySearchString(data);
      }

      if (this.props.groupBy) {
        data = _lodash2.default.groupBy(data, this.props.groupBy);
      }

      return data;
    }

    // build and render the dropdown content
    // will trigger the **ajaxDataFetch** fetch (and show loader) if needed

  }, {
    key: '_getDropdownContent',
    value: function _getDropdownContent() {
      var _this8 = this;

      if (!this.state.isOpen) {
        return null;
      }

      var mouseMoveHandler = void 0,
          pagingLi = void 0,
          searchContent = this._getSearchContent();

      mouseMoveHandler = this.props.pageDataFetch ? this._onMouseMove : null;
      pagingLi = this.state.isFetchingPage ? this._getPagingLi() : null;

      return _react2.default.createElement(
        'div',
        { ref: function ref(c) {
            _this8._rssDOM.dropdownContent = c;
          }, className: 'r-ss-dropdown', onKeyDown: this._handleKeyDown },
        searchContent,
        _react2.default.createElement(
          'div',
          { ref: function ref(c) {
              _this8._rssDOM.scrollWrap = c;
            }, className: 'r-ss-options-wrap', onMouseMove: mouseMoveHandler },
          _react2.default.createElement(
            'ul',
            { className: 'r-ss-dropdown-options',
              ref: function ref(c) {
                _this8._rssDOM.dropdownOptionsList = c;
              },
              tabIndex: '-1',
              id: this._ariaGetListId(),
              role: 'listbox',
              'aria-expanded': this.state.isOpen,
              onWheel: this._arrestScroll },
            this._getOptionsMarkup()
          ),
          pagingLi
        )
      );
    }

    // build the string used as a React component ref for each focusable option

  }, {
    key: '_getFocusedOptionKey',
    value: function _getFocusedOptionKey() {
      return 'option_' + this.state.focusedId;
    }

    // render a group heading, used if **groupBy** option is provided.
    // renders a non-focusable list item for an option group heading

  }, {
    key: '_getGroupHeadingMarkup',
    value: function _getGroupHeadingMarkup(heading) {
      if (!heading) {
        return null;
      }

      var headingClasses = (0, _classnames2.default)("r-ss-option-group-heading", this.props.customGroupHeadingClass),
          headingKey = "heading_" + heading,
          headingMarkup = this.props.customGroupHeadingTemplateFunction ? this.props.customGroupHeadingTemplateFunction(heading) : heading;

      // currently, group headings are aria-hidden so they will not throw off the options count in voiceover
      // in search of a better solution for announcing/navigating grouped listbox items as subgroups
      return _react2.default.createElement(
        'li',
        { tabIndex: '-1', className: headingClasses, key: headingKey, role: 'separator', 'aria-label': heading, 'aria-hidden': true },
        headingMarkup
      );
    }

    // render the content shown when no options are available

  }, {
    key: '_getNoResultsMarkup',
    value: function _getNoResultsMarkup() {
      var _this9 = this;

      var noResultsString = this.props.noResultsString ? this.props.noResultsString : this.props.noResultsString;
      return _react2.default.createElement(
        'li',
        { className: 'r-ss-dropdown-option', tabIndex: '-1' },
        _react2.default.createElement(
          'i',
          { ref: function ref(c) {
              _this9._rssDOM.noResults = c;
            } },
          noResultsString
        )
      );
    }

    // Render the selected options into the trigger element using the normal (i.e. non-tags) behavior.
    // Choose whether to render using the default template or a provided **customOptionTemplateFunction**

  }, {
    key: '_getNormalDisplayMarkup',
    value: function _getNormalDisplayMarkup() {
      var _this10 = this;

      return _lodash2.default.map(this.state.value, function (value) {
        var selectedKey = "r_ss_selected_" + value[_this10.state.labelKey];
        if (_this10.props.customOptionTemplateFunction) {
          return _this10.props.customOptionTemplateFunction(value);
        }
        return _react2.default.createElement(
          'span',
          { key: selectedKey, className: 'r-ss-selected-label' },
          value[_this10.state.labelKey]
        );
      });
    }

    // render a loading span (spinner gif), with **customLoaderClass** if provided

  }, {
    key: '_getLoadingMarkup',
    value: function _getLoadingMarkup() {
      var _this11 = this;

      var loaderClasses = this.props.customLoaderClass ? "r-ss-loader " + this.props.customLoaderClass : "r-ss-loader";
      return _react2.default.createElement('span', { ref: function ref(c) {
          _this11._rssDOM.loader = c;
        }, className: loaderClasses });
    }

    // get the option Li element from a passed eventTarget.
    // for key events = event.target
    // for click events = event.currentTarget

  }, {
    key: '_getOptionIndexFromTarget',
    value: function _getOptionIndexFromTarget(targetLi) {
      return parseInt(targetLi.getAttribute('data-option-index'), 10);
    }

    // render the data source as options,
    // render loading if fetching
    // render ajaxError markup when state.ajaxError is true
    // - when **groupBy** is set, data will be a javascript object.  Run with group heading renders in that case
    // - must track options count to maintain a single focusable index mapping across multiple groups of options

  }, {
    key: '_getOptionsMarkup',
    value: function _getOptionsMarkup() {
      var _this12 = this;

      if (this._needsAjaxFetch()) {
        this._fetchDataViaAjax();
        return this._getPagingLi();
      }

      if (this.state.ajaxError) {
        return this._getAjaxErrorMarkup();
      }

      var data = this._getDataSource();

      var options = [],
          optionsCount = 0;

      if (!_lodash2.default.isArray(data)) {
        _lodash2.default.forIn(data, function (groupedOptions, heading) {
          options.push(_this12._getGroupHeadingMarkup(heading));
          options = options.concat(_this12._getTemplatedOptions(groupedOptions, optionsCount));
          optionsCount = optionsCount + groupedOptions.length;
        });
      } else {
        options = this._getTemplatedOptions(data);
      }

      return options;
    }

    // get the data-option-value attribute for an option node
    // convert to numeric (data-attrs cast to strings) if:
    // the conversion does not alter the string representation's value

  }, {
    key: '_getOptionValueFromDataAttr',
    value: function _getOptionValueFromDataAttr(optionNode) {
      var optionValue = optionNode.getAttribute('data-option-value');

      optionValue = +optionValue + "" === optionValue ? +optionValue : optionValue;
      return optionValue;
    }

    // render a list item with a loading indicator.  Shown while **pageDataFetch** or **ajaxDataFetch** functions run

  }, {
    key: '_getPagingLi',
    value: function _getPagingLi() {
      return _react2.default.createElement(
        'li',
        { key: 'page_loading', className: 'r-ss-page-fetch-indicator', tabIndex: '-1' },
        this._getLoadingMarkup()
      );
    }

    // render a search input bar with a search icon
    // - add localized **searchPlaceholder** if provided
    // - add **customIconClass** if provided

  }, {
    key: '_getSearchContent',
    value: function _getSearchContent() {
      var _this13 = this;

      if (!this.props.searchable) {
        return null;
      }

      var clearSearch = null,
          clearSearchLabelString = this.props.clearSearchLabelString ? this.props.clearSearchLabelString : this.props.clearSearchLabelString,
          magnifierClass = this.props.customSearchIconClass ? this.props.customSearchIconClass : "r-ss-magnifier",
          searchPlaceholderString = this.props.searchPlaceholder ? this.props.searchPlaceholder : this.props.searchPlaceholder,
          searchAriaId = this.state.controlId + '_search',
          searchAriaIdLabel = searchAriaId + '_label';

      if (_lodash2.default.isString(this.state.searchString) && !_lodash2.default.isEmpty(this.state.searchString)) {
        clearSearch = _react2.default.createElement(
          'button',
          { 'aria-label': clearSearchLabelString, ref: function ref(c) {
              _this13._rssDOM.searchClear = c;
            }, name: 'clearSearch', type: 'button', className: 'r-ss-search-clear', onClick: this._clearSearchString, onKeyDown: this._clearSearchString },
          _ref2
        );
      }

      return _react2.default.createElement(
        'div',
        { className: 'r-ss-search-wrap' },
        _react2.default.createElement(
          'div',
          { className: 'r-ss-search-inner' },
          _react2.default.createElement(
            'label',
            { ref: function ref(c) {
                _this13._rssDOM.searchInputLabel = c;
              }, id: searchAriaIdLabel, className: 'r-ss-search-aria-label', htmlFor: searchAriaId },
            searchPlaceholderString
          ),
          _react2.default.createElement('input', { ref: function ref(c) {
              _this13._rssDOM.searchInput = c;
            },
            placeholder: searchPlaceholderString,
            onClick: this._setFocusIdToSearch,
            onChange: this._handleSearch,
            value: this.state.searchString,
            name: searchAriaId,
            id: searchAriaId,
            'aria-labelledby': searchAriaIdLabel,
            'aria-autocomplete': 'list' }),
          clearSearch,
          _react2.default.createElement(
            'i',
            { className: magnifierClass },
            'search'
          )
        )
      );
    }

    // iterate over selected values and build tags markup for selected options display

  }, {
    key: '_getTagsDisplayMarkup',
    value: function _getTagsDisplayMarkup() {
      var _this14 = this;

      return _lodash2.default.map(this.state.value, function (value) {
        return _this14._getTagMarkup(value);
      });
    }

    // render a tag for an individual selected value
    // - add **customTagClass** if provided

  }, {
    key: '_getTagMarkup',
    value: function _getTagMarkup(value) {
      var _this15 = this;

      var displayValue = value[this.state.valueKey],
          tagRemoveIndex = this._getTagRemoveIndex(displayValue);

      var label = value[this.state.labelKey],
          tagKey = 'tag_' + displayValue,
          buttonName = "RemoveTag_" + displayValue,
          tagRemoveButtonLabelString = this.props.tagRemoveLabelString ? this.props.tagRemoveLabelString : this.props.tagRemoveLabelString,
          tagWrapClass = this.props.customTagClass ? "r-ss-tag " + this.props.customTagClass : "r-ss-tag";

      tagRemoveButtonLabelString = tagRemoveButtonLabelString + " " + label;

      return _react2.default.createElement(
        'span',
        { className: tagWrapClass, key: tagKey },
        _react2.default.createElement(
          'span',
          { className: 'r-ss-tag-label' },
          label
        ),
        _react2.default.createElement(
          'button',
          { 'aria-label': tagRemoveButtonLabelString, ref: function ref(c) {
              _this15._rssDOM[tagRemoveIndex] = c;
            }, name: buttonName, type: 'button', className: 'r-ss-tag-remove', onClick: this._removeTagClick.bind(null, value), onKeyDown: this._removeTagKeyPress.bind(null, value) },
          _ref3
        )
      );
    }

    // tagRemovalIndex is used to focus the first tag removal button (as a ref) when deleting tags from keyboard

  }, {
    key: '_getTagRemoveIndex',
    value: function _getTagRemoveIndex(identifier) {
      return "tag_remove_" + identifier;
    }

    // choose a rendering function, either **customOptionTemplateFunction** if provided, or default
    // - render no results markup if no options result from map calls

  }, {
    key: '_getTemplatedOptions',
    value: function _getTemplatedOptions(data, indexStart) {

      indexStart = indexStart || 0;
      var options = this._mapDataToOptionsMarkup(data, indexStart);

      if (options.length === 0) {
        options = this._getNoResultsMarkup();
      }

      return options;
    }

    // close control on document click outside of the control itself
    // react can remove event targets before this executes
    // verify event target node is still in the DOM and close if click did not originate in RSS control

  }, {
    key: '_handleDocumentClick',
    value: function _handleDocumentClick() {
      var event = Array.prototype.slice.call(arguments)[0],
          isTargetStillInDOM = document.body.contains(event.target);

      if (isTargetStillInDOM && !this._rssDOM.rssControl.contains(event.target)) {
        if (this.state.isOpen) {
          this.setState({
            isOpen: false,
            focusedId: undefined
          });
        }
      }
    }

    // main keyDown binding handler for keyboard navigation and selection

  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(event) {
      if (this._isUserSearchTypingEvent(event)) {
        return;
      }
      if (this.state.isOpen) {
        // stop propagation of keyboard events relevant to an open super select
        if (_lodash2.default.includes(this.ariaRelevantKeydownCodes, event.which)) {
          this._arrestEvent(event);
        }
      }

      switch (event.which) {
        case this.keymap.down:
          this._onDownKey(event);
          break;
        case this.keymap.end:
          this._onEndKey();
          break;
        case this.keymap.enter:
          this._onEnterKey(event);
          break;
        case this.keymap.esc:
          this._onEscKey();
          break;
        case this.keymap.home:
          this._onHomeKey();
          break;
        case this.keymap.space:
          this._onEnterKey(event); // delegate to enter
          break;
        case this.keymap.tab:
          // delegate to enter (selection) handler
          if (this.state.isOpen) {
            this._onEnterKey(event);
          } else {
            this._focusRemovalButtons(event);
          }
          break;
        case this.keymap.up:
          this._onUpKey(event);
          break;
      }
    }

    // handler for searchInput's onChange event

  }, {
    key: '_handleSearch',
    value: function _handleSearch(event) {
      this._arrestEvent(event);
      this.setState({
        searchString: event.target.value
      });
    }

    // return the boolean used to determine whether an option should have the 'r-ss-selected' class

  }, {
    key: '_isCurrentlySelected',
    value: function _isCurrentlySelected(dataItem) {
      if (!_lodash2.default.isArray(this.state.value)) {
        return _lodash2.default.isEqual(this.state.value, dataItem);
      }
      return !!_lodash2.default.find(this.state.value, dataItem);
    }

    // tags and mutiple both provide multi-select behavior.  Returns true if either is set to true

  }, {
    key: '_isMultiSelect',
    value: function _isMultiSelect() {
      return this.props.multiple || this.props.tags;
    }

    // user search events need to pass through the default keyDown handler

  }, {
    key: '_isUserSearchTypingEvent',
    value: function _isUserSearchTypingEvent(event) {
      if (!this._rssDOM.searchInput || event.which === this.keymap.down || event.which === this.keymap.up && event.altKey || event.which === this.keymap.esc) {
        return false;
      }
      return event.target === this._rssDOM.searchInput;
    }

    // Render the option list-items.
    // Leverage the **customOptionTemplateFunction** function if provided

  }, {
    key: '_mapDataToOptionsMarkup',
    value: function _mapDataToOptionsMarkup(data, indexStart) {
      var _this16 = this;

      return _lodash2.default.map(data, function (dataOption, index) {
        index = indexStart + index;

        var indexRef = 'option_' + index;

        var isCurrentlySelected = _this16._isCurrentlySelected(dataOption),
            itemKey = "drop_li_" + dataOption[_this16.state.valueKey],
            ariaDescendantId = _this16.state.controlId + '_aria_' + indexRef,
            optionMarkup = _lodash2.default.isFunction(_this16.props.customOptionTemplateFunction) ? _this16.props.customOptionTemplateFunction(dataOption, _this16.state.searchString) : dataOption[_this16.state.labelKey],
            classes = (0, _classnames2.default)('r-ss-dropdown-option', {
          'r-ss-selected': isCurrentlySelected
        });

        return _react2.default.createElement(
          'li',
          { ref: function ref(c) {
              _this16._rssDOM[indexRef] = c;
            },
            id: ariaDescendantId,
            tabIndex: '0',
            'data-option-index': index,
            className: classes,
            'aria-selected': isCurrentlySelected,
            key: itemKey,
            'data-option-value': dataOption[_this16.state.valueKey],
            onClick: _this16._selectItemOnOptionClick.bind(null, dataOption),
            role: 'option' },
          optionMarkup
        );
      });
    }

    // determines next focusedId prior to updateFocusedId call

  }, {
    key: '_moveFocusDown',
    value: function _moveFocusDown() {
      if (this._needsAjaxFetch()) {
        return;
      }
      var nextId = void 0;

      if (_lodash2.default.isUndefined(this.state.focusedId)) {
        if (this.props.searchable) {
          nextId = this.SEARCH_FOCUS_ID;
        } else {
          nextId = 0;
        }
      } else {
        nextId = this.state.lastOptionId === this.state.focusedId ? this.state.lastOptionId : this.state.focusedId + 1;
      }

      this._updateFocusedId(nextId);
    }

    // determines previous focusedId prior to updateFocusedId call

  }, {
    key: '_moveFocusUp',
    value: function _moveFocusUp() {
      var previousId = void 0;

      if (!_lodash2.default.isUndefined(this.state.focusedId) && this.state.focusedId !== this.SEARCH_FOCUS_ID) {
        if (this.state.focusedId === 0) {
          if (this.props.searchable) {
            previousId = this.SEARCH_FOCUS_ID;
          }
        } else {
          previousId = this.state.focusedId - 1;
        }
      }
      this._updateFocusedId(previousId);
    }

    // return boolean to determine if we have already received data from the **ajaxDataFetch** function

  }, {
    key: '_needsAjaxFetch',
    value: function _needsAjaxFetch() {
      return _lodash2.default.isUndefined(this.state.rawDataSource) && _lodash2.default.isFunction(this.props.ajaxDataFetch);
    }

    // down key handler
    // shift-keypress is used to select successive focus items for aria keyboard accessibility

  }, {
    key: '_onDownKey',
    value: function _onDownKey(event) {
      if (!this.state.isOpen) {
        this.toggleDropdown();
        return;
      }

      this._moveFocusDown();
      if (this._isMultiSelect() && event.shiftKey) {
        this._selectFocusedOption(event.target, true);
      }
    }

    // end key handler. Move focus to the last available option

  }, {
    key: '_onEndKey',
    value: function _onEndKey() {
      if (this.state.lastOptionId) {
        this._updateFocusedId(this.state.lastOptionId);
      }
    }

    // Enter key handler.
    // Opens the control when closed.
    // Otherwise, makes selection

  }, {
    key: '_onEnterKey',
    value: function _onEnterKey(event) {
      if (!this.state.isOpen) {
        this.toggleDropdown();
        return;
      }

      if (this._isMultiSelect() && event.shiftKey) {
        this._selectAllOptionsToLastUserSelectedOption(event.target);
        return;
      }

      var keepControlOpen = this._isMultiSelect() && (event.ctrlKey || event.metaKey);

      this._selectFocusedOption(event.target, keepControlOpen);
    }

    // Escape key handler. Closes the dropdown

  }, {
    key: '_onEscKey',
    value: function _onEscKey() {
      this._closeOnKeypress();
    }

    // Home key handler. Moves focus to the first available option

  }, {
    key: '_onHomeKey',
    value: function _onHomeKey() {
      this._updateFocusedId(0);
    }

    // mouse move handler used when **pageDataFetch** is set. It will fire the pageDataFetch function if the user has scrolled sufficiently far in the dropdown

  }, {
    key: '_onMouseMove',
    value: function _onMouseMove() {
      // do not fetch page if searching or already loading data
      if (this._rssDOM.loader || !_lodash2.default.isEmpty(this.state.searchString) || !this._pageFetchingComplete()) {
        return;
      }

      var wrap = this._rssDOM.scrollWrap;

      if (wrap.scrollTop + wrap.offsetHeight >= wrap.scrollHeight) {
        this.setState({
          isFetchingPage: true
        }, this._fetchNextPage);
      }
    }

    // Up key handler.
    // Shift-click is used to select successive focus items for aria keyboard accessibility

  }, {
    key: '_onUpKey',
    value: function _onUpKey(event) {
      if (event.altKey) {
        this._closeOnKeypress();
        return;
      }

      if (this.state.isOpen) {
        this._moveFocusUp();
        if (this._isMultiSelect() && event.shiftKey) {
          this._selectFocusedOption(event.target, true);
        }
      }
    }

    // If hasMorePages option (Function) present, returns the value of its call.
    // Otherwise, returns false so page fetch will not occur

  }, {
    key: '_pageFetchingComplete',
    value: function _pageFetchingComplete() {
      if (!_lodash2.default.isFunction(this.props.hasMorePages)) {
        return false;
      }
      return this.props.hasMorePages(this.state.rawDataSource);
    }

    // Used in shift selection when the event target was previously selected.
    // Remove all options up to, but not including the option that raised the event.
    // (So it behaves like a native browser form multi-select)

  }, {
    key: '_removeAllOptionsInOptionIdRange',
    value: function _removeAllOptionsInOptionIdRange(from, to) {
      var _this17 = this;

      var valuePropsToReject = [],
          start = from <= to ? from : to,
          end = to >= from ? to : from;

      for (var i = start; i <= end; i++) {
        var refString = 'option_' + i,
            option = this._rssDOM[refString];
        if (this.SELECTED_OPTION_REGEX.test(option.getAttribute("class"))) {
          // do not remove the item the user shift-clicked, this is the way browser default shift-click behaves in multi-select
          if (this.lastUserSelectedOption.getAttribute('data-option-value') !== option.getAttribute('data-option-value')) {
            valuePropsToReject.push(this._getOptionValueFromDataAttr(option));
          }
        }
      }

      var remainingSelected = _lodash2.default.reject(this.state.value, function (opt) {
        return _lodash2.default.includes(valuePropsToReject, opt[_this17.state.valueKey]);
      });

      this.setState({
        value: remainingSelected
      }, this._broadcastChange);
    }

    // Remove an item from the state.value selected items array.
    // The *value* arg represents a full dataSource option object

  }, {
    key: '_removeSelectedOptionByValue',
    value: function _removeSelectedOptionByValue(value) {
      var _this18 = this;

      var callback = arguments.length <= 1 || arguments[1] === undefined ? _lodash2.default.noop : arguments[1];

      // clear lastUserSelected if has been removed
      if (this.lastUserSelectedOption && this.lastUserSelectedOption.getAttribute('data-option-value') === value[this.state.valueKey]) {
        this.lastUserSelectedOption = undefined;
      }

      var SelectedAfterRemoval = _lodash2.default.reject(this.state.value, function (option) {
        return option[_this18.state.valueKey] === value[_this18.state.valueKey];
      });

      this.setState({
        value: SelectedAfterRemoval
      }, function () {
        callback();
        _this18._broadcastChange();
      });
    }

    // remove a selected tag on keyDown

  }, {
    key: '_removeTagKeyPress',
    value: function _removeTagKeyPress(value, event) {
      var isEnterKey = event.which === this.keymap.enter,
          isSpaceKey = event.which === this.keymap.space;

      if (isEnterKey || isSpaceKey) {
        this._arrestEvent(event);
        this._removeSelectedOptionByValue(value, this._setFocusToTagRemovalIfPresent); // delegate to removal handler
      }
    }

    // remove a selected tag on click

  }, {
    key: '_removeTagClick',
    value: function _removeTagClick(value, event) {
      this._arrestEvent(event);

      this._removeSelectedOptionByValue(value);
    }

    // used in shift-click range selections

  }, {
    key: '_selectAllOptionsInOptionIdRange',
    value: function _selectAllOptionsInOptionIdRange(from, to) {
      var _this19 = this;

      var valuePropsToSelect = [],
          start = from <= to ? from : to,
          end = to >= from ? to : from;

      for (var i = start; i <= end; i++) {
        var refString = 'option_' + i,
            option = this._rssDOM[refString];
        if (!this.SELECTED_OPTION_REGEX.test(option.getAttribute("class"))) {
          valuePropsToSelect.push(this._getOptionValueFromDataAttr(option));
        }
      }

      var optionsToSelect = _lodash2.default.reduce(this.state.data, function (memo, opt) {
        if (_lodash2.default.includes(valuePropsToSelect, opt[_this19.state.valueKey])) {
          memo.push(opt);
        }
        return memo;
      }, []);
      this._selectItemByValues(optionsToSelect, true);
    }

    // Used in shift-key selection.
    // Select all options from the current eventTarget to the lastUserSelectedOption

  }, {
    key: '_selectAllOptionsToLastUserSelectedOption',
    value: function _selectAllOptionsToLastUserSelectedOption(eventTargetLi) {
      if (!this.lastUserSelectedOption) {
        this.lastUserSelectedOption = eventTargetLi;
        // select all options from the first option to the clicked option
        this._selectAllOptionsInOptionIdRange(0, this._getOptionIndexFromTarget(eventTargetLi));
        return;
      }

      var fromVal = this._getOptionIndexFromTarget(this.lastUserSelectedOption),
          to = this._getOptionIndexFromTarget(eventTargetLi);

      this.lastUserSelectedOption = eventTargetLi;

      // if the option was already selected, this should trigger a removal operation, otherwise trigger an add
      if (this.SELECTED_OPTION_REGEX.test(eventTargetLi.getAttribute('class'))) {
        if (!this.props.deselectOnSelectedOptionClick) {
          return false;
        }
        this._removeAllOptionsInOptionIdRange(fromVal, to);
      } else {
        this._selectAllOptionsInOptionIdRange(fromVal, to);
      }
    }

    // Make a user-selection of the option that is currently focused.
    // Will close the dropDown when keepControlOpen is falsy

  }, {
    key: '_selectFocusedOption',
    value: function _selectFocusedOption(eventTargetLi, keepControlOpen) {
      var focusedOptionKey = this._getFocusedOptionKey();

      if (this._rssDOM[focusedOptionKey]) {
        var optionValue = this._getOptionValueFromDataAttr(this._rssDOM[focusedOptionKey]);

        // store as last userSelected
        this.lastUserSelectedOption = eventTargetLi;

        if (this.SELECTED_OPTION_REGEX.test(this._rssDOM[focusedOptionKey].className)) {
          var optionFullFromValueProp = _lodash2.default.head(this._findArrayOfOptionDataObjectsByValue(optionValue));
          if (!this.props.deselectOnSelectedOptionClick) {
            return false;
          }
          this._removeSelectedOptionByValue(optionFullFromValueProp);
        } else {
          keepControlOpen = keepControlOpen || false;
          this._selectItemByValues(optionValue, keepControlOpen);
        }
      }
    }

    // Handle selection of an option or array of options.
    // Track last selection the user made.
    // Close dropdown on the setState callback if not a non control-closing selection

  }, {
    key: '_selectItemByValues',
    value: function _selectItemByValues(value, keepControlOpen) {
      var _this20 = this;

      var objectValues = this._findArrayOfOptionDataObjectsByValue(value);

      var remainOpenAfterSelection = keepControlOpen || this.props.keepOpenOnSelection;

      if (this._isMultiSelect() || remainOpenAfterSelection && this.state.value) {
        objectValues = this.state.value.concat(objectValues);
      }

      var newState = {
        value: this._isMultiSelect() ? objectValues : [_lodash2.default.head(objectValues)]
      };

      if (this.props.searchable && this.props.clearSearchOnSelection) {
        _lodash2.default.extend(newState, {
          searchString: ""
        });
      }

      this.setState(newState, function () {
        if (!remainOpenAfterSelection) {
          _this20._closeOnKeypress();
        } else {
          _this20._updateFocusedId(parseInt(_this20.lastUserSelectedOption.getAttribute('data-option-index'), 10));
        }
        _this20._broadcastChange();
      });
    }

    // handle option-click (ctrl or meta keys) when selecting additional options in a multi-select control

  }, {
    key: '_selectItemOnOptionClick',
    value: function _selectItemOnOptionClick(value, event) {
      this._arrestEvent(event);

      if (this._isMultiSelect() && event.shiftKey) {
        this._selectAllOptionsToLastUserSelectedOption(event.currentTarget);
        return;
      }
      var keepControlOpen = this._isMultiSelect() && (event.ctrlKey || event.metaKey),
          alreadySelected = this.SELECTED_OPTION_REGEX.test(event.currentTarget.getAttribute('class'));

      // store clicked option as the lastUserSelected
      this.lastUserSelectedOption = event.currentTarget;

      if (alreadySelected) {
        if (!this.props.deselectOnSelectedOptionClick) {
          return false;
        }
        this._removeSelectedOptionByValue(value);
      } else {
        this._selectItemByValues(value[this.state.valueKey], keepControlOpen);
      }
    }

    // set the focusId to the SEARCH_FOCUS_ID constant value

  }, {
    key: '_setFocusIdToSearch',
    value: function _setFocusIdToSearch() {
      this._updateFocusedId(this.SEARCH_FOCUS_ID);
    }

    // if lastUserSelectedOption is populated, focus it, otherwise moveFocusDown

  }, {
    key: '_setFocusOnOpen',
    value: function _setFocusOnOpen() {
      if (this.lastUserSelectedOption) {
        this._updateFocusedId(parseInt(this.lastUserSelectedOption.getAttribute('data-option-index'), 10));
      } else {
        this._moveFocusDown();
      }
    }

    // DOM focus for tag removal buttons will get lost after a tag removal.
    // After tag deletion via keyboard, this Keeps focus in context of tag removal as long as there are more to remove

  }, {
    key: '_setFocusToTagRemovalIfPresent',
    value: function _setFocusToTagRemovalIfPresent() {
      if (!this.props.tags || this.state.value.length === 0) {
        return false;
      }

      var firstValue = _lodash2.default.head(this.state.value)[this.state.valueKey],
          firstTag = this._rssDOM[this._getTagRemoveIndex(firstValue)];

      if (firstTag) {
        if (_lodash2.default.isFunction(firstTag.focus)) {
          firstTag.focus();
          return true;
        }
      }
      return false;
    }

    // Sets the current focusedId.

  }, {
    key: '_updateFocusedId',
    value: function _updateFocusedId(id) {
      this.setState({
        focusedId: id
      });
    }
  }]);

  return ReactSuperSelect;
}(_react2.default.Component);

// Default Property Values
// ------


ReactSuperSelect.defaultProps = {
  clearable: true,
  deselectOnSelectedOptionClick: true,
  disabled: false,
  keepOpenOnSelection: false,
  multiple: false,
  openOnMount: false,
  focusOnMount: false,
  forceDefaultBrowserScrolling: false,
  searchable: false,
  tags: false,
  clearSearchOnSelection: false,
  onCloseDropdown: _lodash2.default.noop,
  onOpenDropdown: _lodash2.default.noop,
  optionLabelKey: 'name',
  optionValueKey: 'id', // value this maps to should be unique in data source
  ajaxErrorString: 'An Error occured while fetching options',
  clearSelectionLabelString: 'Clear Selection',
  clearSearchLabelString: 'Clear Search Field',
  noResultsString: 'No Results Available',
  placeholder: 'Select an Option',
  searchPlaceholder: 'Search',
  tagRemoveLabelString: 'Remove Tag'
};

// Properties
// ------
ReactSuperSelect.propTypes = {
  // BOOLEAN OPTIONS
  // ---------------

  // **clearable** *optional* - (default - true) whether or not to show a button to clear selected options
  clearable: _react2.default.PropTypes.bool,

  // **deselectOnSelectedOptionClick** *optional* - (default - true) whether or not clicking an already-selected option will deselect it
  deselectOnSelectedOptionClick: _react2.default.PropTypes.bool,

  // **disabled** *optional* - (default - false) whether the control is disabled
  disabled: _react2.default.PropTypes.bool,

  // **keepOpenOnSelection** (Boolean) *optional* - Whether to keep the control open when selections are made
  keepOpenOnSelection: _react2.default.PropTypes.bool,

  // **multiple** (Boolean) *optional*  - Whether or not the control supports multi-selection. When using the **tags** display option, this option is redundant
  multiple: _react2.default.PropTypes.bool,

  // **openOnMount** (Boolean) *optional* - Whether or not to render the control open when it initially mounts
  openOnMount: _react2.default.PropTypes.bool,

  // **focusOnMount** (Boolean) *optional* (Used in conjunction with the **openOnMount** option) Whether or not to focus control after opening in componentDidMount lifecycle function
  focusOnMount: _react2.default.PropTypes.bool,

  // **forceDefaultBrowserScrolling** *optional* - (default - false) - Whether to override the default behavior of arresting mouse wheel events in an open select dropdown
  forceDefaultBrowserScrolling: _react2.default.PropTypes.bool,

  // **searchable** (Boolean) *optional* - Whether or not to show a search bar in the dropdown area which offers text-based filtering of the **dataSource** options (by label key)
  searchable: _react2.default.PropTypes.bool,
  // **tags** (Boolean) *optional* - Whether or not to display your chosen multi-select values as tags.  (When set, there is no need to set the **multiple** option)
  tags: _react2.default.PropTypes.bool,

  // **clearSearchOnSelection** (Boolean) *optional* (Used in conjunction with the **searchable** option) whether to auto-clear search field when a selection is made
  clearSearchOnSelection: _react2.default.PropTypes.bool,

  // CSS CLASS / CUSTOM STYLING SUPPORT OPTIONS
  // -----------------------------------

  // **customClass** (String) *optional* - This value will be added as a css class to the control's main wrapping element.  You should be able to overide all styling by leading your rules with
  // ```css
  // .r-ss-wrap.{customClass}
  // ```
  customClass: _react2.default.PropTypes.string,

  // **customGroupHeadingClass** (String) *optional* - Used in conjunction with the **groupBy** option.  The string value will be added as a custom css class to the group headings which are rendered into the dropdown
  customGroupHeadingClass: _react2.default.PropTypes.string,

  // **customSearchIconClass** (String) *optional* - This value will be added as a css class to the icon element in the search-filtering bar (when **searchable** is true).  Allowing you to override the default search icon (default: a magnifying glass)
  customSearchIconClass: _react2.default.PropTypes.string,

  // **customLoaderClass** (String) *optional* - Used in conjunction with the **ajaxDataFetch** option.  This string value will be added as a css class to the loading icon (default: an animated gif spinner as base64 background image in css) allowing css overrides.
  customLoaderClass: _react2.default.PropTypes.string,

  // **customTagClass** (String) *optional* - Used in conjunction with the **tags** option.  This value will be added as a css class to the wrapper of a selection displayed as a tag. You should be able to overide all tag styling by leading your css rules with
  // ```css
  //  .r-ss-tag.{customTagClass}
  //  ```
  customTagClass: _react2.default.PropTypes.string,

  // MAIN CHANGE HANDLER
  // -------------------

  // **onChange** (Function) *required* - This is the main callback handler for the control.  When a user makes selection(s), this handler will be called, the selected option (or when **multiple** or **tags** an array of selected values) will be passed to the handler as an argument.  (The values passed are option objects from the dataSource collection)
  onChange: _react2.default.PropTypes.func.isRequired,

  // ON OPEN / ON CLOSE HANDLERS
  // **onCloseDropdown** (Function) - a callback which will be called when the control closes
  onCloseDropdown: _react2.default.PropTypes.func,

  // **onOpenDropdown** (Function) - a callback which will be called when the control opens
  onOpenDropdown: _react2.default.PropTypes.func,

  // OPTION DATA-RELATED PROPS
  // -------------------------

  // **ajaxDataFetch** (Function) (*optional - but **dataSource** must be supplied if undefined*) - Your select dropdown's data may be fetched via ajax if you provide a function as the value for this option.
  // The function takes no arguments, but it must return a **promise** object. (i.e. an object with a then function).  The promise must resolve with a value meeting the description of the **dataSource** option documentation. The **dataSource** option should be left undefined when using this option.
  ajaxDataFetch: _react2.default.PropTypes.func,

  // **controlId** (String) *optional* - used to generate aria accessibility labels. The control will generate a default value when this prop is left undefined but this prop should be used for apps with isomorphic rendering
  controlId: _react2.default.PropTypes.string,

  // **dataSource** (Array|Object|Collection Object) (*optional - but **ajaxDataFetch** must be supplied if undefined*) - The dataSource option provides the data for your options dropdown.
  // The value provided will go to an internal parser (_configureDataSource), which will return a collection (array of option objects) found based on argument type

  //  The parsing method supports dataSource values as:
  //  - an array of option objects (will be directly assigned to state.data)
  //  - an object with a collection property (object.collection will be assigned to state.data)
  //  - an object with a get function (the return value of object.get('collection') will be assigned to state.data)

  //  Each option in the resulting collection must have the following properties:
  //  - a unique value corresponding to the key set by the **optionValueKey** or the default optionValueKey of **id**
  //  - a defined value corresponding to the key set by the **optionLabelKey** or the default optionLabelKey of **name**
  dataSource: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object), _react2.default.PropTypes.object]),

  // **initialValue** (Array|Object) *optional*
  // The selected value the control will be initialized with
  // must be an array of option items or a single option item from your dataSource collection
  initialValue: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.object), _react2.default.PropTypes.object]),

  // **optionLabelKey** (String) (*optional - defaults to using 'name' as the key if undefined*) - This value represents the key in each option object (from the **dataSource** collection), which represents the value you would like displayed for each option.
  optionLabelKey: _react2.default.PropTypes.string,

  // **optionValueKey** (String) (*optional - defaults to using 'id' as the key if undefined*) - This value represents the key in each option object (from the **dataSource** collection), which represents the value that **uniquely identifies** that option across the **dataSource** collection.  Think of it in terms of the value attribute of a traditional html `<select>` element
  optionValueKey: _react2.default.PropTypes.string, // value this maps to should be unique in data source

  // **pageDataFetch** (Function) *optional* (A *hasMorePages* function should be provided when using this option) - Additional pages of data can be fetched  via ajax if you provide a function as the value for this option.
  // The function takes one argument, the value provided as the **dataSource** (or the return value of the **ajaxDataSource** function).
  // It must return a **promise** object. (i.e. an object with a then function). The promise must resolve with a value meeting the description of the **dataSource** option documentation.
  // The pageDataFetch function will be called based upon the user's scroll position in the dropdown.
  // *It will not be called when loading ajax data, or when filtering results in a searchable dropdown, or when **hasMorePages** evaluates to false
  pageDataFetch: _react2.default.PropTypes.func,

  // **hasMorePages** (Function) *optional* (should be provided when using the *pageDataFetch* option) - A function that accepts one argument, a value as described by the *dataSource* option documentation, and returns a Boolean value.
  // The value should indicate whether the option data collection has any more pages available for fetching
  hasMorePages: _react2.default.PropTypes.func,

  // GROUPING FUNCTIONALITY
  // ----------------------

  // **groupBy** (String|Object|Function) *optional* - Allows you to sort your dropdown options into groups by leveraging Lodash's groupBy function.  Please reference the [Lodash](https://lodash.com/docs#groupBy) documentation for behavior of *groupBy* when passed different argument types
  groupBy: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func, _react2.default.PropTypes.object]),

  // **customGroupHeadingTemplateFunction** (Function) *optional* (Used in conjunction with the **groupBy** option) - This function provides custom templating capability for your dropdown heading options.  The function should accept the value returned as each group's object key (returned by the call of Lodash's groupBy when passed the value of your **groupBy** option)
  customGroupHeadingTemplateFunction: _react2.default.PropTypes.func,

  // RENDERING (OPTION ITERATOR) FUNCTIONS
  // -------------------------------------

  // **customFilterFunction** (Function) *optional* - Used in conjunction with the **searchable** option.  The function provided will serve as a replacement of the default search filter function.
  // and will be called as the predicate function of [Lodash's filter function](https://lodash.com/docs#filter)

  // The function will be called with four arguments, The first three are the usual lodash predicate arguments (value, index|key, collection). The last is the current **searchString** (state variable)

  // When left undefined the default filter function will be used.
  //(Defaults To: A lowercase string comparison for text.  Matches the **optionLabelKey** value to the text entered into the dropdown's search field).  The function is leveraged by [Lodash's filter function](https://lodash.com/docs#filter) with your **dataSource** collection as its first argument.
  customFilterFunction: _react2.default.PropTypes.func,

  // **customOptionTemplateFunction** (Function) *optional* - This function provides custom templating capability for your dropdown options and the display of selected values.  The function should accept a single option object from your **dataSource** collection and return your desired markup based on that object's properties.
  customOptionTemplateFunction: _react2.default.PropTypes.func,

  // **customValueTemplateFunction** (Function) *optional* - This function provides custom templating capability for your control's selected value display.  The function should accept the selected options from your **dataSource** collection and return your desired markup.
  customSelectedValueTemplateFunction: _react2.default.PropTypes.func,

  // LOCALIZATION STRINGS
  // --------------------

  // **ajaxErrorString** (String) *optional* - (Used in conjunction with the **ajaxDataFetch** & **pageDataFetch** options) This string will be shown in the dropdown area when an ajax request fails
  ajaxErrorString: _react2.default.PropTypes.string,

  // **clearSearchLabelString** (String) *optional* - (Used in conjunction with the **clearable** option) This string will be used as an aria-label for the clear selection button
  clearSelectionLabelString: _react2.default.PropTypes.string,

  // **clearSelectionsLabelString** (String) *optional* - (Used in conjunction with the **searchable** option) This string will be used as an aria-label for the clear search button
  clearSearchLabelString: _react2.default.PropTypes.string,

  // **noResultsString** (String) *optional* - A string value which will be displayed when your dropdown shows no results.  (i.e. dataSource is an empty collection, or ajaxDataFetch returns an empty collection)
  noResultsString: _react2.default.PropTypes.string,

  // **placeholder** (String) *optional* - This string value will be displayed in the main display area of your control when the user has no selected values
  placeholder: _react2.default.PropTypes.string,

  // **searchPlaceholder** (String) *optional* - (Used in conjunction with the **searchable** option) This string will be shown in the dropdown area's search input field when a user has not entered any characters.
  searchPlaceholder: _react2.default.PropTypes.string,

  // **tagRemoveLabelString** (String) *optional* - (Used in conjunction with the **tags** option) This string will be used as an aria-label for the remove-tag button on each tag (for accesibility).
  tagRemoveLabelString: _react2.default.PropTypes.string
};

module.exports = ReactSuperSelect;
