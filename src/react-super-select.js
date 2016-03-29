// © Scotland Stephenson 2015

// - [github](https://github.com/alsoscotland/react-super-select)
// - [documentation](http://alsoscotland.github.io/react-super-select/)
// - freely distributed under the MIT license.

var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

// Dependencies
//  - [Lodash](https://lodash.com/)
//  - [classnames](https://www.npmjs.com/package/classnames)
//  - [React](https://facebook.github.io/react/index.html)

var ReactSuperSelect = React.createClass({

// Properties
// ------
  propTypes: {

    // BOOLEAN OPTIONS
    // ---------------

    // **clearable** *optional* - (default - true) whether or not to show a button to clear selected options
    clearable: React.PropTypes.bool,

    // **multiple** (Boolean) *optional*  - Whether or not the control supports multi-selection. When using the **tags** display option, this option is redundant
    multiple: React.PropTypes.bool,
    // **searchable** (Boolean) *optional* - Whether or not to show a search bar in the dropdown area which offers text-based filtering of the **dataSource** options (by label key)
    searchable: React.PropTypes.bool,
    // **tags** (Boolean) *optional* - Whether or not to display your chosen multi-select values as tags.  (When set, there is no need to set the **multiple** option)
    tags: React.PropTypes.bool,

    // CSS CLASS / CUSTOM STYLING SUPPORT OPTIONS
    // -----------------------------------

    // **customClass** (String) *optional* - This value will be added as a css class to the control's main wrapping element.  You should be able to overide all styling by leading your rules with
    // ```css
    // .r-ss-wrap.{customClass}
    // ```
    customClass: React.PropTypes.string,

    // **customGroupHeadingClass** (String) *optional* - Used in conjunction with the **groupBy** option.  The string value will be added as a custom css class to the group headings which are rendered into the dropdown
    customGroupHeadingClass: React.PropTypes.string,

    // **customSearchIconClass** (String) *optional* - This value will be added as a css class to the icon element in the search-filtering bar (when **searchable** is true).  Allowing you to override the default search icon (default: a magnifying glass)
    customSearchIconClass: React.PropTypes.string,

    // **customLoaderClass** (String) *optional* - Used in conjunction with the **ajaxDataFetch** option.  This string value will be added as a css class to the loading icon (default: an animated gif spinner as base64 background image in css) allowing css overrides.
    customLoaderClass: React.PropTypes.string,

    // **customTagClass** (String) *optional* - Used in conjunction with the **tags** option.  This value will be added as a css class to the wrapper of a selection displayed as a tag. You should be able to overide all tag styling by leading your css rules with
    // ```css
    //  .r-ss-tag.{customTagClass}
    //  ```
    customTagClass: React.PropTypes.string,

    // MAIN CHANGE HANDLER
    // -------------------

    // **onChange** (Function) *required* - This is the main callback handler for the control.  When a user makes selection(s), this handler will be called, the selected option (or when **multiple** or **tags** an array of selected values) will be passed to the handler as an argument.  (The values passed are option objects from the dataSource collection)
    onChange: React.PropTypes.func.isRequired,

    // OPTION DATA-RELATED PROPS
    // -------------------------

    // **ajaxDataFetch** (Function) (*optional - but **dataSource** must be supplied if undefined*) - Your select dropdown's data may be fetched via ajax if you provide a function as the value for this option.
    // The function takes no arguments, but it must return a **promise** object. (i.e. an object with a then function).  The promise must resolve with a value meeting the description of the **dataSource** option documentation. The **dataSource** option should be left undefined when using this option.
    ajaxDataFetch: React.PropTypes.func,

    // **dataSource** (Array|Object|Collection Object) (*optional - but **ajaxDataFetch** must be supplied if undefined*) - The dataSource option provides the data for your options dropdown.
    // The value provided will go to an internal parser (_configureDataSource), which will return a collection (array of option objects) found based on argument type

    //  The parsing method supports dataSource values as:
    //  - an array of option objects (will be directly assigned to state.data)
    //  - an object with a collection property (object.collection will be assigned to state.data)
    //  - an object with a get function (the return value of object.get('collection') will be assigned to state.data)

    //  Each option in the resulting collection must have the following properties:
    //  - a unique value corresponding to the key set by the **optionValueKey** or the default optionValueKey of **id**
    //  - a defined value corresponding to the key set by the **optionLabelKey** or the default optionLabelKey of **name**
    dataSource: React.PropTypes.oneOfType([
              React.PropTypes.arrayOf(React.PropTypes.object),
              React.PropTypes.object
            ]),

    // **initialValue** (Array|Object) *optional*
    // The selected value the control will be initialized with
    // must be an array of option items or a single option item from your dataSource collection
    initialValue: React.PropTypes.oneOfType([
              React.PropTypes.arrayOf(React.PropTypes.object),
              React.PropTypes.object
            ]),

    // **optionLabelKey** (String) (*optional - defaults to using 'name' as the key if undefined*) - This value represents the key in each option object (from the **dataSource** collection), which represents the value you would like displayed for each option.
    optionLabelKey: React.PropTypes.string,

    // **optionValueKey** (String) (*optional - defaults to using 'id' as the key if undefined*) - This value represents the key in each option object (from the **dataSource** collection), which represents the value that **uniquely identifies** that option across the **dataSource** collection.  Think of it in terms of the value attribute of a traditional html `<select>` element
    optionValueKey: React.PropTypes.string, // value this maps to should be unique in data source

    // **pageDataFetch** (Function) *optional* (A *hasMorePages* function should be provided when using this option) - Additional pages of data can be fetched  via ajax if you provide a function as the value for this option.
    // The function takes one argument, the value provided as the **dataSource** (or the return value of the **ajaxDataSource** function).
    // It must return a **promise** object. (i.e. an object with a then function). The promise must resolve with a value meeting the description of the **dataSource** option documentation.
    // The pageDataFetch function will be called based upon the user's scroll position in the dropdown.
    // *It will not be called when loading ajax data, or when filtering results in a searchable dropdown, or when **hasMorePages** evaluates to false
    pageDataFetch: React.PropTypes.func,

    // **hasMorePages** (Function) *optional* (should be provided when using the *pageDataFetch* option) - A function that accepts one argument, a value as described by the *dataSource* option documentation, and returns a Boolean value.
    // The value should indicate whether the option data collection has any more pages available for fetching
    hasMorePages: React.PropTypes.func,

    // GROUPING FUNCTIONALITY
    // ----------------------

    // **groupBy** (String|Object|Function) *optional* - Allows you to sort your dropdown options into groups by leveraging Lodash's groupBy function.  Please reference the [Lodash](https://lodash.com/docs#groupBy) documentation for behavior of *groupBy* when passed different argument types
    groupBy: React.PropTypes.oneOfType([
              React.PropTypes.string,
              React.PropTypes.func,
              React.PropTypes.object
            ]),

    // **customGroupHeadingTemplateFunction** (Function) *optional* (Used in conjunction with the **groupBy** option) - This function provides custom templating capability for your dropdown heading options.  The function should accept the value returned as each group's object key (returned by the call of Lodash's groupBy when passed the value of your **groupBy** option)
    customGroupHeadingTemplateFunction: React.PropTypes.func,

    // RENDERING (OPTION ITERATOR) FUNCTIONS
    // -------------------------------------

    // **customFilterFunction** (Function) *optional* - Used in conjunction with the **searchable** option.  The function provided will serve as a replacement of the default search filter function.
    // and will be called as the predicate function of [Lodash's filter function](https://lodash.com/docs#filter)


    // The function will be called with four arguments, The first three are the usual lodash predicate arguments (value, index|key, collection). The last is the current **searchString** (state variable)


    // When left undefined the default filter function will be used.
    //(Defaults To: A lowercase string comparison for text.  Matches the **optionLabelKey** value to the text entered into the dropdown's search field).  The function is leveraged by [Lodash's filter function](https://lodash.com/docs#filter) with your **dataSource** collection as its first argument.
    customFilterFunction: React.PropTypes.func,

    // **customOptionTemplateFunction** (Function) *optional* - This function provides custom templating capability for your dropdown options and the display of selected values.  The function should accept a single option object from your **dataSource** collection and return your desired markup based on that object's properties.
    customOptionTemplateFunction: React.PropTypes.func,

    // LOCALIZATION STRINGS
    // --------------------

    // **ajaxErrorString** (String) *optional* - (Used in conjunction with the **ajaxDataFetch** & **pageDataFetch** options) This string will be shown in the dropdown area when an ajax request fails
    ajaxErrorString: React.PropTypes.string,

    // **clearSearchLabelString** (String) *optional* - (Used in conjunction with the **clearable** option) This string will be used as an aria-label for the clear selection button
    clearSelectionLabelString: React.PropTypes.string,

    // **clearSelectionsLabelString** (String) *optional* - (Used in conjunction with the **searchable** option) This string will be used as an aria-label for the clear search button
    clearSearchLabelString: React.PropTypes.string,

    // **noResultsString** (String) *optional* - A string value which will be displayed when your dropdown shows no results.  (i.e. dataSource is an empty collection, or ajaxDataFetch returns an empty collection)
    noResultsString: React.PropTypes.string,

    // **placeholder** (String) *optional* - This string value will be displayed in the main display area of your control when the user has no selected values
    placeholder: React.PropTypes.string,

    // **searchPlaceholder** (String) *optional* - (Used in conjunction with the **searchable** option) This string will be shown in the dropdown area's search input field when a user has not entered any characters.
    searchPlaceholder: React.PropTypes.string,

    // **tagRemoveLabelString** (String) *optional* - (Used in conjunction with the **tags** option) This string will be used as an aria-label for the remove-tag button on each tag (for accesibility).
    tagRemoveLabelString: React.PropTypes.string
  },

  // CONSTANTS
  // ---------

  // used as the focusedID state variable value, when the search input field of a **searchable** control has focus.
  SEARCH_FOCUS_ID: -1,

  // regular expression used to determine if event src options have selected class
  SELECTED_OPTION_REGEX: /r-ss-selected/,

  // Default string values for localization options
  DEFAULT_LOCALIZATIONS: {
    ajaxErrorString: 'An Error occured while fetching options',
    clearSelectionLabelString: 'Clear Selection',
    clearSearchLabelString: 'Clear Search Field',
    noResultsString: 'No Results Available',
    placeholder: 'Select an Option',
    searchPlaceholder: 'Search',
    tagRemoveLabelString: 'Remove Tag'
  },

  // STATE VARIABLES
  // ---------------
  getInitialState: function() {
    return {
      // **ajaxError** (Boolean) - Set to true when an ajax request fails
      ajaxError: false,

      // **controlId** (String) - A unique identifier for the rss control. This value is used to generate aria accessibility labels
      controlId: _.uniqueId('rss_'),

      // **data** (Array of Objects) the active dataSource collection used to map to option elements, with any search filtering results reflected
      data: this._configureDataSource(this.props.dataSource),

      // **rawDataSource** (Object|Array) The raw dataSource value the user supplies through the *dataSource* prop (or returned from *ajaxDataFetch* / *pageDataFetch*). This value is passed to the *pageDataFetch* callback
      rawDataSource: this.props.dataSource,

      // **isOpen** (Boolean) - Whether or not the dropdown is open
      isOpen: false,

      // **focusedId** (Number) - Used to track keyboard focus for accessibility
      focusedId: undefined,

      // **labelKey** (String) - The option object key that will be used to identify the value displayed as an option's label
      labelKey: this.props.optionLabelKey || 'name',

      // **lastOptionId** (Number) - Used in keyboard navigation to focus the last available option in the dropdown
      lastOptionId: (_.isArray(this.props.dataSource) && (this.props.dataSource.length > 0)) ? this.props.dataSource.length - 1 : undefined,

      // **searchString** (String) - When the **searchable** option is true, this is the user-entered value in the search field. It is used for data filtering based on the label key's value
      searchString: undefined,

      // **value** (Array) - An array that holds the current user-selected option(s)
      value: this._buildInitialValue(),

      // **valueKey** (String) - The option object key that will be used to identify the value used as an option's value property (values must be unique across data source)
      valueKey: this.props.optionValueKey || 'id'
    };
  },

  // KEYMAP CONSTANT
  // ------
  // A text-based lookup for keyboard navigation keys and their corresponding 'which' keycode values
  keymap: {
    'down': 40,
    'end': 35, // goto last option ?
    'enter': 13,
    'esc': 27,
    'home': 36, // go to first option ?
    'space': 32,
    'tab': 9,
    'up': 38
  },

  // NON-STATE VARS (no need to re-render based on these being set)

  // **lastUserSelectedOptionData** - A store of the last user-selected option, used for accesibility-related option focusing, as well as shift-click selection
  lastUserSelectedOption: undefined,

  // wire document click close control handler
  componentDidMount: function() {
    document.addEventListener('click', this._handleDocumentClick);
    document.addEventListener('touchstart', this._handleDocumentClick);
  },

  // remove binding for document click close control handler
  componentWillUnmount: function() {
    document.removeEventListener('click', this._handleDocumentClick);
    document.removeEventListener('touchstart', this._handleDocumentClick);
  },

  // If parent page updates the data source, reset all control state values which are derived from props.
  // Reset some state defaults and dataSource related fields if dataSource changed.
  componentWillReceiveProps: function(nextProps) {
    var newState = {};

    if (!_.isEqual(nextProps.initialValue, this.props.initialValue)) {
      newState.value = this._buildInitialValue(nextProps);
    }

    if (!_.isUndefined(nextProps.optionLabelKey) && (nextProps.optionLabelKey !== this.props.optionLabelKey)) {
      newState.labelKey = nextProps.optionLabelKey;
    }

    if (!_.isUndefined(nextProps.optionValueKey) && (nextProps.optionValueKey !== this.props.optionValueKey)) {
      newState.valueKey = nextProps.optionValueKey;
    }

    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)) {

      this.lastUserSelectedOption = undefined;

      newState = _.extend(newState, {
        data: this._configureDataSource(nextProps.dataSource),
        rawDataSource: nextProps.dataSource,
        focusedId: undefined,
        lastOptionId: (_.isArray(nextProps.dataSource) && (nextProps.dataSource.length > 0)) ? nextProps.dataSource.length - 1 : undefined
      });

    }

    if (!_.isEmpty(newState)) {
      this.setState(newState);
    }
  },

  // Update focused element after re-render
  componentDidUpdate: function() {
    this._focusCurrentFocusedId();
  },

  // main render method
  render: function() {
    var clearSelectionButton = null,
        clearSelectionLabelString = this.props.clearSelectionLabelString ? this.props.clearSelectionLabelString : this.DEFAULT_LOCALIZATIONS.clearSelectionLabelString,
        dropdownContent = this._getDropdownContent(),
        placeholderString,
        triggerDisplayContent,
        triggerClasses,
        caratClass = classNames('carat', {
          'down': !this.state.isOpen,
          'up': this.state.isOpen
        }),
        wrapClasses;

    wrapClasses = classNames("r-ss-wrap", this.props.customClass, {
      'r-ss-expanded': this.state.isOpen
    });

    triggerClasses = classNames('r-ss-trigger', {
      'r-ss-open': this.state.isOpen,
      'r-ss-placeholder': this.state.value.length < 1
    });

    placeholderString = this.props.placeholder ? this.props.placeholder : this.DEFAULT_LOCALIZATIONS.placeholder;
    triggerDisplayContent = this.state.value.length ? this._generateValueDisplay() : placeholderString;

    if (!_.isEmpty(this.state.value) && (this.props.clearable !== false)) {
      clearSelectionButton = (<button aria-label={clearSelectionLabelString} ref="selectionClear" name="clearSelection" type="button" className="r-ss-selection-clear" onClick={this._clearSelection} onKeyDown={this._clearSelection}>
                                <span />
                             </button>);
    }

    return (
      <div ref="rssControl" id={this.state.controlId} className={wrapClasses}>
        <div ref="triggerDiv"
           className={triggerClasses}
           onClick={this.toggleDropdown}
           onKeyDown={this._handleKeyDown}
           role="combobox"
           aria-activedescendant={this._ariaGetActiveDescendentId()}
           aria-haspopup={true}
           aria-controls={this._ariaGetListId()}
           aria-label={placeholderString}
           aria-multiselectable={this._isMultiSelect()}
           tabIndex="0">
            {triggerDisplayContent}
            {clearSelectionButton}
            <span ref="carat" className={caratClass}> </span>
        </div>
        {dropdownContent}
      </div>);
  },

  // toggles the open-state of the dropdown
  // sets focused option in callback after opening
  toggleDropdown: function() {
    this.setState({
      'isOpen': !this.state.isOpen
    }, function() {
      if (this.state.isOpen) {
        this._setFocusOnOpen();
      }
    });
  },

  // returns the unique DOM id for the currently focused option. Used for accessibility-related labeling
  _ariaGetActiveDescendentId: function() {
    var ariaActiveDescendantId = null,
        optionRef = this._getFocusedOptionKey();
    if (this.refs[optionRef]) {
      ariaActiveDescendantId = this.refs[optionRef].id;
    }
    return ariaActiveDescendantId;
  },

  // calculate the unique identifier for the options ul for aria compliance labeling usage
  _ariaGetListId: function() {
    return this.state.controlId + '_list';
  },

  // helper for stopping event propagation
  _arrestEvent: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  // stop wheel events in dropdown from scrolling page
  _arrestScroll: function(event) {
    let arrestScroll = false,
        adjustedHeight = this.refs.scrollWrap.scrollTop + this.refs.scrollWrap.clientHeight;

    if (event.deltaY > 0) {
      if (adjustedHeight >= this.refs.scrollWrap.scrollHeight) {
        arrestScroll = true;
      }
    } else {
      if (this.refs.scrollWrap.scrollTop <= 0) {
        arrestScroll = true;
      }
    }

    if (arrestScroll) {
      this._arrestEvent(event);
    }
  },

  // call onChange handler with updated value
  // should be called as setState callback when changing state.value
  // will call with undefined when no values are set
  _broadcastChange: function() {
    let outputValue = this._isMultiSelect() ? this.state.value : _.head(this.state.value);
    outputValue = _.isEmpty(outputValue) ? undefined : outputValue;
    this.props.onChange(outputValue);
  },

  // calculate the initial value for the control from props, componentWillReceiveProps will call passing nextProps
  _buildInitialValue: function(props) {
    props = props || this.props;
    var initialValue = [];

    if (!_.isUndefined(props.initialValue)) {
      initialValue = _.isArray(props.initialValue) ? props.initialValue : [props.initialValue];

      if (!this._isMultiSelect()) {
        initialValue = [_.head(initialValue)];
      }
    }

    return initialValue;
  },

  // clear the searchString value
  // for **searchable** controls
  _clearSearchString: function() {
    this.setState({
      searchString: undefined
    }, this._setFocusIdToSearch);
  },

  // clear the selected options
  // for **clearable** controls
  _clearSelection: function(event) {
    if ((event.which === this.keymap.enter) || (event.which === this.keymap.space) || (event.type === "click")) {
      event.stopPropagation();
      this.setState({
        value: []
      }, () => {
        this._focusTrigger();
        this._broadcastChange();
      });
    }
  },

  // close the dropdown
  // resets focus to the main control trigger
  // clear focused id
  _closeOnKeypress: function() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
        focusedId: undefined
      }, this._focusTrigger);
    }
  },

  // overloaded dataSource parser (Object|Array)
  // case: (object) - look for a collection property which is an array, or runs an existing 'get' function, get('collection'), and determines if the return value is an array
  // case: (Array) - return the dataSource array for use as this.state.data
  _configureDataSource: function(dataSource) {
    if (_.isArray(dataSource)) {
     return dataSource;
    }

    if (_.isObject(dataSource)) {
      if (_.isArray(dataSource.collection)) {
        return dataSource.collection;
      }

      if (_.isFunction(dataSource.get)) {
        var collection = dataSource.get('collection');
        if (_.isArray(collection)) {
          return collection;
        }
      }
    }

    return [];
  },

  // Used if no **customFilterFunction** provided for filtering the data options shown in a **searchable** control.
  // Runs a lowercase string comparison with the **searchString** and the value corresponding to an option's **optionLabelKey**
  _defaultSearchFilter: function(option) {
    var search = this.state.searchString.toLowerCase();
    if (!_.isString(option[this.state.labelKey])) {
      return false;
    }
    return option[this.state.labelKey].toLowerCase().indexOf(search) > -1;
  },

  // fetch data source via ajax if **ajaxDataFetch** function provided
  // handles success and failure for ajax call
  _fetchDataViaAjax: function() {
    var self = this;
    this.props.ajaxDataFetch(this.state.rawDataSource).then(function(dataSourceFromAjax) {
      self.setState({
        ajaxError: false,
        data: self._configureDataSource(dataSourceFromAjax),
        rawDataSource: dataSourceFromAjax
      });
    }, function() {
      self.setState({
        ajaxError: true,
        // define as empty array on error so that _needsAjaxFetch will evaluate to false
        rawDataSource: []
      });
    });
  },

  // Fetch the next page of options data if **pageDataFetch** function provided.
  // Called onMouseMove if scroll position in dropdown exceeds threshold.
  // Handles success and failure for ajax call
  _fetchNextPage: function() {
    var self = this;
    this.props.pageDataFetch(this.state.rawDataSource).then(function(dataSourceFromPageFetch) {
      self.setState({
        ajaxError: false,
        data: self._configureDataSource(dataSourceFromPageFetch),
        rawDataSource: dataSourceFromPageFetch,
        isFetchingPage: false
      });
    }, function() {
        self.setState({
          ajaxError: true
        });
    });
  },

  // choose the appropriate search filter function and run the filter against the options data
  _filterDataBySearchString: function(data) {
    var self = this;
    var filterFunction = this._defaultSearchFilter;
    if (_.isFunction(this.props.customFilterFunction)) {
      filterFunction = function(value, index, collection) {
        return self.props.customFilterFunction.apply(self, [value, index, collection, self.state.searchString.toLowerCase()]);
      };
    }
    return _.filter(data, filterFunction);
  },

  // used when selecting values, returns an array of full option-data objects which contain any single value, or any one of an array of values passed in
  _findArrayOfOptionDataObjectsByValue: function(value) {
    var valuesArray = _.isArray(value) ? _.map(value, this.state.valueKey) : [value];
    return _.reject(this.state.data, (item) => {
      return !_.includes(valuesArray, item[this.state.valueKey]);
    });
  },

  // determine whether to focus a option value in the DOM, or the search field
  _focusCurrentFocusedId: function() {
    if (this.state.focusedId < 0) {
      this._focusSearch();
      return;
    }

    this._focusDOMOption();
  },

  // focus the DOM option identified by the current state.focusedId
  _focusDOMOption: function() {
    var optionRef = this._getFocusedOptionKey();
    if (this.refs[optionRef]) {
      if (_.isFunction(this.refs[optionRef].focus)) {
        this.refs[optionRef].focus();
      }
    }
  },

  // focus the dropdown's search field if it exists
  _focusSearch: function() {
    if (this.refs.searchInput) {
      this.refs.searchInput.focus();
    }
  },

  // shift focus from dropdown trigger to any removal/clear buttons
  // for keyboard navigation and accessibility
  _focusRemovalButtons: function(event) {
    var triggerContainer = this.refs.triggerDiv,
        buttons = triggerContainer.getElementsByTagName('button'),
        currentlyFocusedRemoveButtonIndex,
        nextButtonIndexToFocus;

    if (buttons.length) {
      for (let i=0; i< buttons.length; i++) {
        if (buttons[i] === document.activeElement) {
          currentlyFocusedRemoveButtonIndex = i;
          nextButtonIndexToFocus = event.shiftKey ? i-1 : i+1;
        }
      }
    }

    if (buttons[nextButtonIndexToFocus]) {
      this._arrestEvent(event);
      buttons[nextButtonIndexToFocus].focus();
    } else if(nextButtonIndexToFocus && (nextButtonIndexToFocus < 0)) {
      this._focusTrigger();
    } else if(buttons[0] && !_.isNumber(currentlyFocusedRemoveButtonIndex)) {
      this._arrestEvent(event);
      buttons[0].focus();
    }

  },

  // focus the main trigger element of the control if the user is interacting with this control instance
  _focusTrigger: function() {
    this.refs.triggerDiv.focus();
  },

  // choose whether to template the display of user-selected values normally, or as tags
  _generateValueDisplay: function() {
    if (!this.props.tags) {
      return this._getNormalDisplayMarkup();
    } else {
      return this._getTagsDisplayMarkup();
    }
  },

  // render the content shown if an ajax error occurs
  _getAjaxErrorMarkup: function() {
    var errorString = this.props.ajaxErrorString ? this.props.ajaxErrorString : this.DEFAULT_LOCALIZATIONS.ajaxErrorString;
    return (<li className="r-ss-dropdown-option error"><i ref="errorDisplay">{errorString}</i></li>);
  },

  // calculate and return the renderable data source object or array, factoring in the search filtering, and any grouping functionality
  _getDataSource: function() {
    var data = _.isArray(this.state.data) ? this.state.data : [];
    if (_.isString(this.state.searchString)) {
      data = this._filterDataBySearchString(data);
    }

    if (this.props.groupBy) {
      data = _.groupBy(data, this.props.groupBy);
    }

    return data;
  },

  // build and render the dropdown content
  // will trigger the **ajaxDataFetch** fetch (and show loader) if needed
  _getDropdownContent: function() {
    if (!this.state.isOpen) {
      return null;
    }

    var searchContent = this._getSearchContent(),
        mouseMoveHandler,
        pagingLi;

    mouseMoveHandler = (this.props.pageDataFetch) ? this._onMouseMove : null;
    pagingLi = this.state.isFetchingPage ? this._getPagingLi() : null;

    return(
      <div ref="dropdownContent" className="r-ss-dropdown" onKeyDown={this._handleKeyDown}>
        {searchContent}
        <div ref="scrollWrap" className="r-ss-options-wrap" onMouseMove={mouseMoveHandler}>
          <ul className="r-ss-dropdown-options"
              ref="dropdownOptionsList"
              tabIndex="-1"
              id={this._ariaGetListId()}
              role="listbox"
              aria-expanded={this.state.isOpen}
              onWheel={this._arrestScroll}>
            {this._getOptionsMarkup()}
          </ul>
          {pagingLi}
        </div>
      </div>
    );
  },

  // build the string used as a React component ref for each focusable option
  _getFocusedOptionKey: function() {
    return 'option_' + this.state.focusedId;
  },

  // render a group heading, used if **groupBy** option is provided.
  // renders a non-focusable list item for an option group heading
  _getGroupHeadingMarkup: function(heading) {
    if (!heading) {
      return null;
    }

    var headingClasses = classNames("r-ss-option-group-heading", this.props.customGroupHeadingClass),
        headingKey = "heading_" + heading,
        headingMarkup = this.props.customGroupHeadingTemplateFunction ? this.props.customGroupHeadingTemplateFunction(heading) : heading;

    // currently, group headings are aria-hidden so they will not throw off the options count in voiceover
    // in search of a better solution for announcing/navigating grouped listbox items as subgroups
    return(
      <li tabIndex="-1" className={headingClasses} key={headingKey} role="separator" aria-label={heading} aria-hidden={true}>
        {headingMarkup}
      </li>);
  },

  // render the content shown when no options are available
  _getNoResultsMarkup: function() {
    var noResultsString = this.props.noResultsString ? this.props.noResultsString : this.DEFAULT_LOCALIZATIONS.noResultsString;
    return (<li className="r-ss-dropdown-option" tabIndex="-1"><i ref="noResults">{noResultsString}</i></li>);
  },

  // Render the selected options into the trigger element using the normal (i.e. non-tags) behavior.
  // Choose whether to render using the default template or a provided **customOptionTemplateFunction**
  _getNormalDisplayMarkup: function() {
    return _.map(this.state.value, (value) => {
      var selectedKey = "r_ss_selected_" + value[this.state.labelKey];
      if (this.props.customOptionTemplateFunction) {
        return this.props.customOptionTemplateFunction(value);
      } else {
        return (<span key={selectedKey} className="r-ss-selected-label">{value[this.state.labelKey]}</span>);
      }
    });
  },

  // render a loading span (spinner gif), with **customLoaderClass** if provided
  _getLoadingMarkup: function() {
    var loaderClasses = this.props.customLoaderClass ? "r-ss-loader " + this.props.customLoaderClass : "r-ss-loader";
    return (<span ref="loader" className={loaderClasses}></span>);
  },

  // get the option Li element from a passed eventTarget.
  // for key events = event.target
  // for click events = event.currentTarget
  _getOptionIndexFromTarget: function(targetLi) {
    return parseInt(targetLi.getAttribute('data-option-index'), 10);
  },

  // render the data source as options,
  // render loading if fetching
  // render ajaxError markup when state.ajaxError is true
  // - when **groupBy** is set, data will be a javascript object.  Run with group heading renders in that case
  // - must track options count to maintain a single focusable index mapping across multiple groups of options
  _getOptionsMarkup: function() {
    if (this._needsAjaxFetch()) {
      this._fetchDataViaAjax();
      return this._getPagingLi();
    }

    if (this.state.ajaxError) {
      return this._getAjaxErrorMarkup();
    }

    var data = this._getDataSource(),
        options = [],
        optionsCount = 0;

    if (!_.isArray(data)) {
      _.forIn(data, (groupedOptions, heading) => {
        options.push(this._getGroupHeadingMarkup(heading));
        options = options.concat(this._getTemplatedOptions(groupedOptions, optionsCount));
        optionsCount = optionsCount + groupedOptions.length;
      });
    } else {
      options = this._getTemplatedOptions(data);
    }

    return options;
  },

  // get the data-option-value attribute for an option node
  // convert to numeric (data-attrs cast to strings) if:
  // the conversion does not alter the string representation's value
  _getOptionValueFromDataAttr: function(optionNode) {
    var optionValue = optionNode.getAttribute('data-option-value');

    optionValue = (+optionValue + "" === optionValue) ? +optionValue : optionValue;
    return optionValue;
  },

  // render a list item with a loading indicator.  Shown while **pageDataFetch** or **ajaxDataFetch** functions run
  _getPagingLi: function() {
    return(<li key="page_loading" className="r-ss-page-fetch-indicator" tabIndex="-1">
            {this._getLoadingMarkup()}
          </li>);
  },

  // render a search input bar with a search icon
  // - add localized **searchPlaceholder** if provided
  // - add **customIconClass** if provided
  _getSearchContent: function() {
    if (!this.props.searchable) {
      return null;
    }

    var clearSearch = null,
        clearSearchLabelString = this.props.clearSearchLabelString ? this.props.clearSearchLabelString : this.DEFAULT_LOCALIZATIONS.clearSearchLabelString,
        magnifierClass = this.props.customSearchIconClass ? this.props.customSearchIconClass : "r-ss-magnifier",
        searchPlaceholderString = this.props.searchPlaceholder ? this.props.searchPlaceholder : this.DEFAULT_LOCALIZATIONS.searchPlaceholder,
        searchAriaId = this.state.controlId + '_search',
        searchAriaIdLabel = searchAriaId + '_label';

    if (_.isString(this.state.searchString)) {
      clearSearch = (<button aria-label={clearSearchLabelString} ref="searchClear" name="clearSearch" type="button" className="r-ss-search-clear" onClick={this._clearSearchString} onKeyDown={this._clearSearchString}>
                       <span />
                     </button>);
    }

    return(
      <div className="r-ss-search-wrap">
        <div className="r-ss-search-inner">
          <label ref="searchInputLabel" id={searchAriaIdLabel} className="r-ss-search-aria-label" htmlFor={searchAriaId}>{searchPlaceholderString}</label>
          <input ref="searchInput"
                 placeholder={searchPlaceholderString}
                 onClick={this._setFocusIdToSearch}
                 onChange={this._handleSearch}
                 value={this.state.searchString}
                 name={searchAriaId}
                 id={searchAriaId}
                 aria-labelledby={searchAriaIdLabel}
                 aria-autocomplete="list" />
          {clearSearch}
          <i className={magnifierClass}>search</i>
        </div>
      </div>
    );
  },

  // iterate over selected values and build tags markup for selected options display
  _getTagsDisplayMarkup: function() {
    return _.map(this.state.value, (value) => {
      return this._getTagMarkup(value);
    });
  },

  // render a tag for an individual selected value
  // - add **customTagClass** if provided
  _getTagMarkup: function(value) {
    var label = value[this.state.labelKey],
        displayValue = value[this.state.valueKey],
        tagKey = 'tag_' + displayValue,
        buttonName = "RemoveTag_" + displayValue,
        tagRemoveIndex = this._getTagRemoveIndex(displayValue),
        tagRemoveButtonLabelString = this.props.tagRemoveLabelString ? this.props.tagRemoveLabelString : this.DEFAULT_LOCALIZATIONS.tagRemoveLabelString,
        tagWrapClass = this.props.customTagClass ? "r-ss-tag " + this.props.customTagClass : "r-ss-tag";

    tagRemoveButtonLabelString = tagRemoveButtonLabelString + " " + label;

    return (
      <span className={tagWrapClass} key={tagKey}>
        <span className="r-ss-tag-label">{label}</span>
        <button aria-label={tagRemoveButtonLabelString} ref={tagRemoveIndex} name={buttonName} type="button" className="r-ss-tag-remove" onClick={this._removeTagClick.bind(null, value)} onKeyDown={this._removeTagKeyPress.bind(null, value)}>
          <span />
        </button>
      </span>);
  },

  // tagRemovalIndex is used to focus the first tag removal button (as a ref) when deleting tags from keyboard
  _getTagRemoveIndex: function(identifier) {
    return "tag_remove_" + identifier;
  },

  // choose a rendering function, either **customOptionTemplateFunction** if provided, or default
  // - render no results markup if no options result from map calls
  _getTemplatedOptions: function(data, indexStart) {
    indexStart = indexStart || 0;
    var options = this._mapDataToOptionsMarkup(data, indexStart);

    if (options.length === 0) {
      options = this._getNoResultsMarkup();
    }

    return options;
  },

  // close control on document click outside of the control itself
  _handleDocumentClick: function(event) {
    if (!this.refs.rssControl.contains(event.target)) {
      this._closeOnKeypress();
    }
  },

  // main keyDown binding handler for keyboard navigation and selection
  _handleKeyDown: function(event) {
    if (this._isUserSearchTypingEvent(event)) {
      return;
    }

    if (this.state.isOpen || (event.which !== this.keymap.tab)) {
      this._arrestEvent(event);
    }

    switch(event.which) {
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
      case this.keymap.tab: // delegate to enter (selection) handler
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
  },

  // handler for searchInput's onChange event
  _handleSearch: function(event) {
    this._arrestEvent(event);
    this.setState({
      searchString: event.target.value
    });
  },

  // return the boolean used to determine whether an option should have the 'r-ss-selected' class
  _isCurrentlySelected: function(dataItem) {
    if (!_.isArray(this.state.value)) {
      return _.isEqual(this.state.value, dataItem);
    }
    return !!(_.find(this.state.value, dataItem));
  },

  // tags and mutiple both provide multi-select behavior.  Returns true if either is set to true
  _isMultiSelect: function() {
    return this.props.multiple || this.props.tags;
  },

  // user search events need to pass through the default keyDown handler
  _isUserSearchTypingEvent: function(event) {
    if (!this.refs.searchInput || (event.which === this.keymap.down) || ((event.which === this.keymap.up) && event.altKey) || (event.which === this.keymap.esc)) {
      return false;
    }
    return (event.target === this.refs.searchInput);
  },

  // Render the option list-items.
  // Leverage the **customOptionTemplateFunction** function if provided
  _mapDataToOptionsMarkup: function(data, indexStart) {
    return _.map(data, (dataOption, index) => {
      index = indexStart + index;

      var isCurrentlySelected = this._isCurrentlySelected(dataOption),
          itemKey = "drop_li_" + dataOption[this.state.valueKey],
          indexRef = 'option_' + index,
          ariaDescendantId = this.state.controlId + '_aria_' + indexRef,
          optionMarkup = _.isFunction(this.props.customOptionTemplateFunction) ? this.props.customOptionTemplateFunction(dataOption) : dataOption[this.state.labelKey],
          classes = classNames('r-ss-dropdown-option', {
            'r-ss-selected': isCurrentlySelected
          });

      return (
        <li ref={indexRef}
            id={ariaDescendantId}
            tabIndex="0"
            data-option-index={index}
            className={classes}
            aria-selected={isCurrentlySelected}
            key={itemKey}
            data-option-value={dataOption[this.state.valueKey]}
            onClick={this._selectItemOnOptionClick.bind(null, dataOption)}
            role="option">
          {optionMarkup}
        </li>);
    });
  },

  // determines next focusedId prior to updateFocusedId call
  _moveFocusDown: function() {
    if (this._needsAjaxFetch()) {
      return;
    }
    var nextId;

    if (_.isUndefined(this.state.focusedId)) {
      if (this.props.searchable) {
        nextId = this.SEARCH_FOCUS_ID;
      } else {
        nextId = 0;
      }
    } else {
      nextId = (this.state.lastOptionId === this.state.focusedId) ? this.state.lastOptionId : this.state.focusedId + 1;
    }

    this._updateFocusedId(nextId);
  },

  // determines previous focusedId prior to updateFocusedId call
  _moveFocusUp: function() {
    var previousId;

    if (!_.isUndefined(this.state.focusedId) && (this.state.focusedId !== this.SEARCH_FOCUS_ID)) {
      if (this.state.focusedId === 0) {
        if (this.props.searchable) {
          previousId = this.SEARCH_FOCUS_ID;
        }
      } else {
        previousId = this.state.focusedId - 1;
      }
    }
    this._updateFocusedId(previousId);
  },

  // return boolean to determine if we have already received data from the **ajaxDataFetch** function
  _needsAjaxFetch: function() {
    return (_.isUndefined(this.state.rawDataSource) && _.isFunction(this.props.ajaxDataFetch));
  },

  // down key handler
  // shift-keypress is used to select successive focus items for aria keyboard accessibility
  _onDownKey: function(event) {
    if (!this.state.isOpen) {
      this.toggleDropdown();
      return;
    }

    this._moveFocusDown();
    if (this._isMultiSelect() && event.shiftKey) {
      this._selectFocusedOption(event.target, true);
    }
  },

  // end key handler. Move focus to the last available option
  _onEndKey: function() {
    if (this.state.lastOptionId) {
      this._updateFocusedId(this.state.lastOptionId);
    }
  },

  // Enter key handler.
  // Opens the control when closed.
  // Otherwise, makes selection
  _onEnterKey: function(event) {
    if (!this.state.isOpen) {
      this.toggleDropdown();
      return;
    }

    if (this._isMultiSelect() && event.shiftKey) {
      this._selectAllOptionsToLastUserSelectedOption(event.target);
      return;
    }

    var keepControlOpen = (this._isMultiSelect() && (event.ctrlKey || event.metaKey));

    this._selectFocusedOption(event.target, keepControlOpen);
  },

  // Escape key handler. Closes the dropdown
  _onEscKey: function() {
    this._closeOnKeypress();
  },

  // Home key handler. Moves focus to the first available option
  _onHomeKey: function() {
    this._updateFocusedId(0);
  },

  // mouse move handler used when **pageDataFetch** is set. It will fire the pageDataFetch function if the user has scrolled sufficiently far in the dropdown
  _onMouseMove: function() {
    // do not fetch page if searching or already loading data
    if (this.refs.loader || this.state.searchString || !this._pageFetchingComplete()) {
      return;
    }

    var wrap = this.refs.scrollWrap;

    if ((wrap.scrollTop + wrap.offsetHeight) >= wrap.scrollHeight) {
      this.setState({
        isFetchingPage: true
      }, this._fetchNextPage);
    }
  },

  // Up key handler.
  // Shift-click is used to select successive focus items for aria keyboard accessibility
  _onUpKey: function(event) {
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
  },

  // If hasMorePages option (Function) present, returns the value of its call.
  // Otherwise, returns false so page fetch will not occur
  _pageFetchingComplete: function() {
    if (!_.isFunction(this.props.hasMorePages)) {
      return false;
    } else {
      return this.props.hasMorePages(this.state.rawDataSource);
    }
  },

  // Used in shift selection when the event target was previously selected.
  // Remove all options up to, but not including the option that raised the event.
  // (So it behaves like a native browser form multi-select)
  _removeAllOptionsInOptionIdRange: function(from, to) {
    var valuePropsToReject = [],
        start = (from <= to) ? from : to,
        end = (to >= from) ? to : from;

    for (var i = start; i <= end; i++) {
      var refString = 'option_' + i,
      option = this.refs[refString];
      if (this.SELECTED_OPTION_REGEX.test(option.getAttribute("class"))) {
        // do not remove the item the user shift-clicked, this is the way browser default shift-click behaves in multi-select
        if (this.lastUserSelectedOption.getAttribute('data-option-value') !== option.getAttribute('data-option-value')) {
          valuePropsToReject.push(this._getOptionValueFromDataAttr(option));
        }
      }
    }

    var remainingSelected = _.reject(this.state.value, (opt) => {
        return _.includes(valuePropsToReject, opt[this.state.valueKey]);
      });

    this.setState({
      value: remainingSelected
    }, this._broadcastChange);
  },

  // Remove an item from the state.value selected items array.
  // The *value* arg represents a full dataSource option object
  _removeSelectedOptionByValue: function(value, callback = _.noop) {
    // clear lastUserSelected if has been removed
    if (this.lastUserSelectedOption && (this.lastUserSelectedOption.getAttribute('data-option-value') === value[this.state.valueKey])) {
      this.lastUserSelectedOption = undefined;
    }

    var SelectedAfterRemoval = _.reject(this.state.value, (option) => {
                                 return option[this.state.valueKey] === value[this.state.valueKey];
                               });

    this.setState({
      value: SelectedAfterRemoval
    }, () => {
      callback();
      this._broadcastChange();
    });
  },

  // remove a selected tag on keyDown
  _removeTagKeyPress: function(value, event) {
    var isEnterKey = event.which === this.keymap.enter,
        isSpaceKey = event.which === this.keymap.space;

    if (isEnterKey || isSpaceKey) {
      this._arrestEvent(event);
      this._removeSelectedOptionByValue(value, this._setFocusToTagRemovalIfPresent); // delegate to removal handler
    }

  },

  // remove a selected tag on click
  _removeTagClick: function(value, event) {
    this._arrestEvent(event);

    this._removeSelectedOptionByValue(value);
  },

  // used in shift-click range selections
  _selectAllOptionsInOptionIdRange: function(from, to) {
    var valuePropsToSelect = [],
        start = (from <= to) ? from : to,
        end = (to >= from) ? to : from;

    for (var i = start; i <= end; i++) {
      var refString = 'option_' + i,
      option = this.refs[refString];
      if (!this.SELECTED_OPTION_REGEX.test(option.getAttribute("class"))) {
        valuePropsToSelect.push(this._getOptionValueFromDataAttr(option));
      }
    }

    var optionsToSelect = _.reduce(this.state.data, (memo, opt) => {
          if (_.includes(valuePropsToSelect, opt[this.state.valueKey])) {
            memo.push(opt);
          }
          return memo;
        }, []);
    this._selectItemByValues(optionsToSelect, true);
  },

  // Used in shift-key selection.
  // Select all options from the current eventTarget to the lastUserSelectedOption
  _selectAllOptionsToLastUserSelectedOption: function(eventTargetLi) {
    if (!this.lastUserSelectedOption) {
      this.lastUserSelectedOption = eventTargetLi;
      // select all options from the first option to the clicked option
      this._selectAllOptionsInOptionIdRange(0, this._getOptionIndexFromTarget(eventTargetLi));
      return;
    }

    var from = this._getOptionIndexFromTarget(this.lastUserSelectedOption),
        to = this._getOptionIndexFromTarget(eventTargetLi);

    this.lastUserSelectedOption = eventTargetLi;

    // if the option was already selected, this should trigger a removal operation, otherwise trigger an add
    if (this.SELECTED_OPTION_REGEX.test(eventTargetLi.getAttribute('class'))) {
      this._removeAllOptionsInOptionIdRange(from, to);
    } else {
      this._selectAllOptionsInOptionIdRange(from, to);
    }
  },

  // Make a user-selection of the option that is currently focused.
  // Will close the dropDown when keepControlOpen is falsy
  _selectFocusedOption: function(eventTargetLi, keepControlOpen) {

    var focusedOptionKey = this._getFocusedOptionKey();
    if (this.refs[focusedOptionKey]) {
      var optionValue = this._getOptionValueFromDataAttr(this.refs[focusedOptionKey]);

      // store as last userSelected
      this.lastUserSelectedOption = eventTargetLi;

      if (this.SELECTED_OPTION_REGEX.test(this.refs[focusedOptionKey].className)) {
        var optionFullFromValueProp = _.head(this._findArrayOfOptionDataObjectsByValue(optionValue));
        this._removeSelectedOptionByValue(optionFullFromValueProp);
      } else {
        keepControlOpen = keepControlOpen || false;
        this._selectItemByValues(optionValue, keepControlOpen);
      }
    }
  },

  // Handle selection of an option or array of options.
  // Track last selection the user made.
  // Close dropdown on the setState callback if not a non control-closing selection
  _selectItemByValues: function(value, keepControlOpen) {
   var objectValues = this._findArrayOfOptionDataObjectsByValue(value);

    if (this._isMultiSelect() || (keepControlOpen && this.state.value)) {
      objectValues = this.state.value.concat(objectValues);
    }

    this.setState({
      value: this._isMultiSelect() ? objectValues : [_.head(objectValues)]
    }, () => {
      if (!keepControlOpen) {
        this._closeOnKeypress();
      }
      this._broadcastChange();
    });

  },

  // handle option-click (ctrl or meta keys) when selecting additional options in a multi-select control
  _selectItemOnOptionClick: function(value, event) {
    if (this._isMultiSelect() && event.shiftKey) {
      this._selectAllOptionsToLastUserSelectedOption(event.currentTarget);
      return;
    }
    var keepControlOpen = (this._isMultiSelect() && (event.ctrlKey || event.metaKey)),
        alreadySelected = this.SELECTED_OPTION_REGEX.test(event.currentTarget.getAttribute('class'));

    // store clicked option as the lastUserSelected
    this.lastUserSelectedOption = event.currentTarget;

    if (alreadySelected) {
      this._removeSelectedOptionByValue(value);
    } else {
      this._selectItemByValues(value[this.state.valueKey], keepControlOpen);
    }
  },

  // set the focusId to the SEARCH_FOCUS_ID constant value
  _setFocusIdToSearch: function() {
    this._updateFocusedId(this.SEARCH_FOCUS_ID);
  },

  // if lastUserSelectedOption is populated, focus it, otherwise moveFocusDown
  _setFocusOnOpen: function() {
    if (this.lastUserSelectedOption) {
      this._updateFocusedId(parseInt(this.lastUserSelectedOption.getAttribute('data-option-index'), 10));
    } else {
      this._moveFocusDown();
    }
  },

  // DOM focus for tag removal buttons will get lost after a tag removal.
  // After tag deletion via keyboard, this Keeps focus in context of tag removal as long as there are more to remove
  _setFocusToTagRemovalIfPresent: function() {
    if (!this.props.tags || (this.state.value.length === 0)) {
      return false;
    }

    var firstValue = _.head(this.state.value)[this.state.valueKey],
        firstTag = this.refs[this._getTagRemoveIndex(firstValue)];

    if (firstTag) {
      if (_.isFunction(firstTag.focus)) {
        firstTag.focus();
        return true;
      }
    }
    return false;
  },

  // Sets the current focusedId.
  _updateFocusedId: function(id) {
    this.setState({
      focusedId: id
    });
  }

});

module.exports = ReactSuperSelect;
