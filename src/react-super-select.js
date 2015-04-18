// © Scotland Stephenson 2015

// - [github](https://github.com/alsoscotland/react-super-select)
// - [documentation](http://alsoscotland.github.io/react-super-select/)
// - freely distributed under the MIT license.

var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

// Dependencies
//  - [Lodash](https://lodash.com/)
//  - [classNames](https://www.npmjs.com/package/classnames)
//  - [React](https://facebook.github.io/react/index.html)

var ReactSuperSelect = React.createClass({

// Properties
// ------

  propTypes: {

    // BOOLEAN OPTIONS
    // ---------------

    // **multiple** (Boolean) *optional*  - set true for a multi-select control with normal or custom templating.  When using the **tags** display option, this option is redundant
    multiple: React.PropTypes.bool,
    // **searchable** (Boolean) *optional* - whether or not to show a search bar in the dropdown area which offers text-based filtering of the options-set (by label key)
    searchable: React.PropTypes.bool,
    // **tags** (Boolean) *optional* - Whether or not to display your chosen multi-select values as tags.  (When set, there is no need to set the **multiple** option)
    tags: React.PropTypes.bool,

    // CSS CLASS / CUSTOM STYLING SUPPORT OPTIONS
    // -----------------------------------

    // **customClassName** (String) *optional* - this string value will be added as a css class to the control's main wrapping element.  You should be able to overide all styling with one point of css specificity by leading your rules with
    // ```css
    // .r-ss-wrap.{customClassName}
    // ```
    customClassName: React.PropTypes.string,

    // **customGroupHeadingClass** (String) *optional* - Used in conjunction with the **groupBy** option.  Will add a custom css class to the group headings which are rendered into the dropdown
    customGroupHeadingClass: React.PropTypes.string,

    // **customSearchIconClass** (String) *optional* - This class name will be added to the icon in the search-filtering bar (when **searchable** is true).  Allowing you to override the default search icon (default: a magnifying glass)
    customSearchIconClass: React.PropTypes.string,

    // **customLoaderClass** (String) *optional* - Used in conjunction with the **ajaxDataSource** option.  A css class which will be added to the loading icon (default: an animated gif spinner as base64 background image in css) allowing css overrides.
    customLoaderClass: React.PropTypes.string,

    // **customTagClass** (String) *optional* - Used in conjunction with the **tags** option.  A css class which will be added to wrapper of a selection displayed as a tag. You should be able to overide all tag styling with one point of css specificity by leading your rules with
    // ```css
    //  .r-ss-tag.{customTagClass}
    //  ```
    customTagClass: React.PropTypes.string,

    // MAIN CHANGE HANDLER
    // -------------------

    // **onChange** (Function) *required* - This is the main callback handler for the control.  When a user makes selection(s) the selected option, or when **multiple** or **tags**, an array of selected values (object from the dataSource collection) will be passed to this handler function.
    onChange: React.PropTypes.func.isRequired,

    // OPTION DATA-RELATED PROPS
    // -------------------------

    // **ajaxDataSource** (Function) (*optional - but **dataSource** must be supplied if undefined*) - Your select dropdown's data may be fetched via ajax if you provide a function as the value for this option.
    // The function takes no arguments, but it must return a **promise** object. (i.e. an object with a then function).  The promise must resolve with an array of objects (a collection) as described by the **dataSource** option documentation. Or a single option object.  The **dataSource** option should be left undefined when using this option.
    ajaxDataSource: React.PropTypes.func,

    // **dataSource** (An Array of Objects, i.e. a collection) (*optional - but **ajaxDataSource** must be supplied if undefined*) - The dataSource option provides the data for your options dropdown. Each option in the collection must have:
    //  - a unique value in the key set by the **optionValueKey** or the default of **id**
    //  - a value in the key set by the **optionLabelKey** or the default of **name**
    dataSource: React.PropTypes.arrayOf(React.PropTypes.object),

    // **optionLabelKey** (String) (*optional - will use 'name' key if undefined*) - This value represents the key in each option object in your **dataSource** collection which represents the value you would like displayed for each option.
    optionLabelKey: React.PropTypes.string,

    // **optionValueKey** (String) (*optional - will use 'id' key if undefined*) - This value represents the key in each option object in your **dataSource** collection which represents the value that uniquely identifies that option across the dataSource collection.  Think of it in terms of the value attribute of a traditional html `<select>` element
    optionValueKey: React.PropTypes.string, // value this maps to should be unique in data source

    // **pageFetch** (Function) *optional* - Additional pages of data can be fetched  via ajax if you provide a function as the value for this option.  The function takes one argument, the current data array.
    // It must return a **promise** object. (i.e. an object with a then function).  The promise **must resolve with an object with two properties**.
    //  - **collection** (Array of Objects) the array of data to be used as described by the **dataSource** option documentation.  The array should be the collection value passed into this function augmented with the data from the new page.
    //  - **complete** (Boolean) indicates whether all pages have been fetched (i.e. do not fetch more pages)
    // The pageFetch function will be called based upon the user's scroll position in the dropdown.  *It will not be called when loading ajax data, or when filtering results in a searchable dropdown*
    pageFetch: React.PropTypes.func,

    // GROUPING FUNCTIONALITY
    // ----------------------

    // **groupBy** (String|Object|Function) *optional* - Allows you to sort your dropdown options into groups by leveraging Lodash's groupBy function.  Please reference [Lodash](https://lodash.com/docs#groupBy) documentation for behavior of *groupBy* when passed different argument types
    groupBy: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func,
            React.PropTypes.object
          ]),

    // **customGroupHeadingTemplateFunction** (Function) *optional* (Used in conjunction with the **groupBy** option)- This function provides custom templating capability for your dropdown heading options.  The function should accept the value returned as each group's object key (returned by the call of Lodash's groupBy when passed the value of your **groupBy** option)
    customGroupHeadingTemplateFunction: React.PropTypes.func,

    // RENDERING (OPTION ITERATOR) FUNCTIONS
    // -------------------------------------

    // **customFilterFunction** (Function) *optional* - Used in conjunction with the **searchable** options.  The function provided for this option will serve as a replacement of the default search filter function.
    //(A default lowercase string comparison for text.  Matches the **optionLabelKey** value to the text entered into the dropdown's search field).  The function is passed as the second arg to [Lodash's filter function](https://lodash.com/docs#filter) and is along with your **dataSource** as the first arg.
    customFilterFunction: React.PropTypes.func,

    // **customOptionTemplateFunction** (Function) *optional* - This function provides custom templating capability for your dropdown options and the display of selected values.  The function should accept a single option object from your **dataSource** collection and return your desired markup based on that object's properties.
    customOptionTemplateFunction: React.PropTypes.func,

    // LOCALIZATION STRINGS
    // --------------------

    // **noResultsString** (String) *optional* - A string value which will be displayed when your dropdown shows no results.  (i.e. dataSource is an empty collection, or ajaxDataSource returns an empty collection)
    noResultsString: React.PropTypes.string,

    // **placeholder** (String) *optional* - This string value will be displayed in the main display area of your control before a user has selected any values
    placeholder: React.PropTypes.string,

    // **searchPlaceholder** (String) *optional* - (Used in conjunction with the **searchable** option) This string will be shown in the dropdown area's searchfield when a user has not entered any characters.
    searchPlaceholder: React.PropTypes.string
  },


  // CONSTANTS
  // ---------

  // represents the focusedID state variable value for the search field of a **searchable** control.
  SEARCH_FOCUS_ID: -1,


  // STATE VARIABLES
  // ---------------
  getInitialState: function() {
    return {
      // **data** (Array of Objects) the data source array used to map to option elements
      data: this.props.dataSource,
      // **isOpen** (Boolean) - whether the dropdown is open
      isOpen: false,
      // **focusedId** (Number) - used to track keyboard focus for accessibility
      focusedId: undefined,
      // **labelKey** (String) - the option object key that will be used to identify the value used as an option's label
      labelKey: this.props.optionLabelKey || 'name',
      // **lastOptionId** (Number) - Used in keyboard navigation to focus the last available option
      lastOptionId: (_.isArray(this.props.dataSource) && (this.props.dataSource.length > 0)) ? this.props.dataSource.length - 1 : undefined,
      // **searchString** (String) - When the **searchable** option is true, this is the user-entered value in the search field used for data filtering based on the label key's value
      searchString: undefined,
      // **value** (Array) - An array that holds the currently selected option(s)
      value: [],
      // **valueKey** (String) - the option object key that will be used to identify the value used as an option's value property (values must be unique across data source)
      valueKey: this.props.optionValueKey || 'id'
    };
  },

  // KEYMAP
  // ------
  // text based lookup map for keyboard navigation keys and their corresponding 'which' keycode values
  keymap: {
    'down': 40,
    'end': 35, // goto last option ?
    'enter': 13,
    'esc': 27,
    'home': 36, // go to first option ?
    'left': 37,
    'right': 39,
    'space': 32,
    'tab': 9,
    'up': 38
  },

  // If parent page updates the data source, reset the control with some defaults and the new data source.
  componentWillReceiveProps: function(nextProps) {
    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)) {
      this.setState({
        data: nextProps.dataSource,
        focusedId: undefined,
        pageFetchingComplete: undefined,
        labelKey: nextProps.optionLabelKey || 'name',
        lastOptionId: (_.isArray(nextProps.dataSource) && (nextProps.dataSource.length > 0)) ? nextProps.dataSource.length - 1 : undefined,
        valueKey: nextProps.optionValueKey || 'id'
      });
    }
  },

  // Update focused element after re-render
  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.focusedId === this.state.focusedId) {
      return;
    }
    this._focusCurrentFocusedId();
  },

  // main render method
  render: function() {
    var dropdownContent = this._getDropdownContent(),
        valueDisplayClass,
        triggerDisplayContent,
        triggerClasses,
        caratClass = classNames('carat', {
          'down': !this.state.isOpen,
          'up': this.state.isOpen
        }),
        wrapClasses;

    wrapClasses = classNames("r-ss-wrap", this.props.customClassName, {
      'r-ss-expanded': this.state.isOpen
    });

    triggerClasses = classNames('r-ss-trigger', {
      'r-ss-open': this.state.isOpen
    });
    triggerDisplayContent = this.state.value.length ? this._generateValueDiplay() : this.props.placeholder;
    valueDisplayClass = classNames('r-ss-value-display', {
      'r-ss-placeholder': this.state.value.length < 1,
    });

    return (
      <div ref="rssControl" className={wrapClasses}>
        <div ref="triggerDiv" className={triggerClasses} onClick={this.toggleDropdown} onKeyUp={this._handleKeyUp} aria-haspopup="true">
          <a ref="triggerAnchor" className="r-ss-mock-input" tabIndex="0" aria-label={this.props.placeholder}>
            <div className={valueDisplayClass} ref="valueDisplay">{triggerDisplayContent}</div>
            <span ref="carat" className={caratClass}> </span>
          </a>
        </div>
        {dropdownContent}
      </div>);
  },

  // toggles the open-state of the dropdown
  toggleDropdown: function() {
    this.setState({
      'isOpen': !this.state.isOpen
    });
  },

  // close the dropdown and
  // resets focus to main control trigger
  _closeOnKeypress: function() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
        focusedId: undefined
      }, this._focusTrigger);
    }
  },

  // used if no **customFilterFunction** provided for filtering the data options shown in a **searchable** control,
  // runs a lowercase string comparison with the **searchString** and the value corresponding to an option's **optionLabelKey**
  _defaultSearchFilter: function(option) {
    var search = this.state.searchString.toLowerCase();
    if (!_.isString(option[this.state.labelKey])) {
      return false;
    }
    return option[this.state.labelKey].toLowerCase().indexOf(search) > -1;
  },


  // fetch data source via ajax if **ajaxDataSource** function provided
  _fetchDataViaAjax: function() {
    var self = this;
    this.props.ajaxDataSource().then(function(optionDataFromAjax) {
      var data = _.isArray(optionDataFromAjax) ? optionDataFromAjax : [];
      self.setState({
        data: data
      });
    });
  },

  // fetch the next page of options data if **pageFetch** function provided,
  // called onMouseMove if scroll position in dropdown exceeds threshold
  _fetchNextPage: function() {
    var self = this,
        currentData = this.state.data || [];
    this.props.pageFetch(currentData).then(function(dataFromPageFetch) {
      dataFromPageFetch = dataFromPageFetch || {};
      var data = _.isArray(dataFromPageFetch.collection) ? dataFromPageFetch.collection: [];
      self.setState({
        pageFetchingComplete: dataFromPageFetch.complete,
        isFetchingPage: false,
        data: data
      });
    });
  },

  // choose the appropriate search filter function and run the filter against the options data
  _filterDataBySearchString: function(data) {
    var filterFunction = _.isFunction(this.props.customFilterFunction) ? this.props.customFilterFunction : this._defaultSearchFilter;
    return _.filter(data, filterFunction);
  },

  // used when selecting values, returns an array of full option-data objects which contain any single value or any one of an array of values passed in
  _findArrayOfOptionDataObjectsByValue: function(value) {
    var self = this,
        valuesArray = _.isArray(value) ? _.pluck(value, this.state.valueKey) : [value];
    return _.reject(this.state.data, function(item) {
      return !_.contains(valuesArray, item[self.state.valueKey]);
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

  // focus the DOM option locatable by the current focusedId
  _focusDOMOption: function() {
    var optionRef = this._getFocusedOptionKey();
    if (this.refs[optionRef]) {
      if (_.isFunction(this.refs[optionRef].getDOMNode().focus)) {
        this.refs[optionRef].getDOMNode().focus();
      }
    }
  },

  // focus the dropdown's search field if it exists
  _focusSearch: function() {
    if (this.refs.searchInput) {
      this.refs.searchInput.getDOMNode().focus();
    }
  },

  // focus the main trigger element of the control
  _focusTrigger: function() {
    if (this.refs.triggerAnchor) {
      this.refs.triggerAnchor.getDOMNode().focus();
    }
  },

  // choose whether to calculate the display values normally, or as tags
  _generateValueDiplay: function() {
    if (!this.props.tags) {
      return this._getNormalDisplayMarkup();
    } else {
      return this._getTagsDisplayMarkup();
    }
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

  // determine and render the dropdown content
  // will trigger the **ajaxDataSource** fetch (and show loader) if needed
  _getDropdownContent: function() {
    if (!this.state.isOpen) {
      return null;
    }

    var dropdownContent,
        searchContent = this._getSearchContent(),
        mouseMoveHandler,
        pagingLi;

    if (this._needsAjaxFetch()) {
      this._fetchDataViaAjax();
      dropdownContent = this._getLoadingMarkup();
    } else {
      dropdownContent = this._getOptionsMarkup();
    }

    mouseMoveHandler = (this.props.pageFetch) ? this._onMouseMove : null;
    pagingLi = this.state.isFetchingPage ? this._getPagingLi() : null;

    return(
      <div ref="dropdownContent" className="r-ss-dropdown" onKeyUp={this._handleKeyUp}>
        {searchContent}
        <div ref="scrollWrap" className="r-ss-options-wrap" onMouseMove={mouseMoveHandler}>
          <ul className="r-ss-dropdown-options" ref="dropdownOptionsList" aria-hidden={!this.state.isOpen} role="menubar">
            {dropdownContent}
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

    return(
      <li tabIndex="-1" className={headingClasses} key={headingKey} role="separator">
        {headingMarkup}
      </li>);
  },

  // render the content shown if no options are available
  _getNoResultsMarkup: function() {
    var noResultsString = this.props.noResultsString ? this.props.noResultsString : 'No Results Available';
    return (<li className="r-ss-dropdown-option"><i ref="noResults">{noResultsString}</i></li>);
  },

  // render the selected options into the trigger element using the default (non-tags) behavior
  // - choose whether to render the default template or a provided **customOptionTemplateFunction**
  _getNormalDisplayMarkup: function() {
    var self = this;
    var markup = _.map(this.state.value, function(value) {
      if (self.props.customOptionTemplateFunction) {
        return self.props.customOptionTemplateFunction(value);
      } else {
        return value[self.state.labelKey];
      }
    });
    return markup;
  },

  // render a loading span (spinner gif), with **customLoaderClass** if provided
  _getLoadingMarkup: function() {
    var loaderClasses = this.props.customLoaderClass ? "r-ss-loader " + this.props.customLoaderClass : "r-ss-loader";
    return (<span ref="loader" className={loaderClasses}></span>);
  },

  // render the data source as options,
  // - when **groupBy** is set, data will be a javascript object.  Run with group heading renders in that case
  // - must track options count to maintain a single focusable index mapping across multiple groups of options
  _getOptionsMarkup: function() {
    var data = this._getDataSource(),
        self = this,
        options = [],
        optionsCount = 0;

    if (!_.isArray(data)) {
      _.forIn(data, function(groupedOptions, heading) {
        options.push(self._getGroupHeadingMarkup(heading));
        options = options.concat(self._getTemplatedOptions(groupedOptions, optionsCount));
        optionsCount = optionsCount + groupedOptions.length;
      });
    } else {
      options = this._getTemplatedOptions(data);
    }

    return options;
  },

  // render a list item with a loading indicator.  shown while **pageFetch** function runs
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

    var magnifierClass = this.props.customSearchIconClass ? this.props.customSearchIconClass : "r-ss-magnifier";

    return(
      <div className="r-ss-search-wrap">
        <div className="r-ss-search-inner">
          <input ref="searchInput" placeholder={this.props.searchPlaceholder} onKeyUp={this._handleSearch} onClick={this._setFocusIdToSearch} defaultValue={this.state.searchString} />
          <i className={magnifierClass}>search</i>
        </div>
      </div>
    );
  },

  // iterate over selected values and build tags markup for selected options display
  _getTagsDisplayMarkup: function() {
    var self = this;
    var markup = _.map(this.state.value, function(value) {
      return self._getTagMarkup(value);
    });
    return markup;
  },

  // render a tag for an individual selected value
  // - add **customTagClass** if provided
  _getTagMarkup: function(value) {
    var label = value[this.state.labelKey],
        displayValue = value[this.state.valueKey],
        tagKey = 'tag_' + displayValue,
        buttonName = "RemoveTag_" + displayValue,
        tagWrapClass = this.props.customTagClass ? "r-ss-tag " + this.props.customTagClass : "r-ss-tag";

    return (
      <span className={tagWrapClass} key={tagKey}>
        <span className="r-ss-tag-label">{label}</span>
        <button name={buttonName} type="button" className="r-ss-tag-remove" onClick={this._removeTagClick.bind(null, value)} onKeyUp={this._removeTagKeyPress.bind(null, value)}>X</button>
      </span>);
  },

  // choose a rendering function, either **customOptionTemplateFunction** if provided, or default
  // - render no results markup if no options result from map calls
  _getTemplatedOptions: function(data, indexStart) {
    indexStart = indexStart || 0;
    var options = _.isFunction(this.props.customOptionTemplateFunction) ? this._mapDataToCustomTemplateMarkup(data, indexStart) : this._mapDataToDefaultTemplateMarkup(data, indexStart);

    if (options.length === 0) {
      options = this._getNoResultsMarkup();
    }

    return options;
  },

  // main keyup binding map for keyboard navigation and selection
  _handleKeyUp: function(event) {
    event.preventDefault();
    event.stopPropagation();

    switch(event.which) {
      case this.keymap.down:
        this._onDownKey();
        break;
      case this.keymap.end:
        this._onEndKey();
        break;
      case this.keymap.enter:
        if (event.shiftKey) {
          this._handleShiftKeyUpSelect();
        } else {
          this._onEnterKey(event);
        }
        break;
      case this.keymap.esc:
        this._onEscKey();
        break;
      case this.keymap.home:
        this._onHomeKey();
        break;
      case this.keymap.left: // delegate to up handler
        this._onUpKey();
        break;
      case this.keymap.right: // delegate to down handler
        this._onDownKey();
        break;
      case this.keymap.space:
        if (event.shiftKey) {
          this._handleShiftKeyUpSelect();
        } else {
          this._onEnterKey(event); // delegate to enter
        }
        break;
      case this.keymap.tab: // delegate to down handler if not at top level of UI DOM
        if (typeof this.focusedId !== 'undefined') {
          this._onDownKey();
        }
        break;
      case this.keymap.up:
        this._onUpKey();
        break;
    }
  },

  // handler for searchInput's keyUp event
  _handleSearch: function(event) {
    var searchString = event.target.value;
    this._handleSearchDebounced.call(this, searchString);
    this._handleKeyUp(event);
  },

  // debounced handler for searchInput's keyUp event, reduces # of times the control re-renders
  _handleSearchDebounced: _.debounce(function(search) {
    this.setState({
      searchString: search
    });
  }, 300),

  // handle selecting a range of options at once when shift-key is depressed during click
  _handleShiftSelect: function(value, event) {
    var optionIndex = parseInt(event.currentTarget.getAttribute('data-option-index'), 10);
    if (optionIndex === 0) {
      return;
    }
    this._selectAllFromOptionRefToLastSelected(optionIndex);
  },

  // handle selecting a range of options at once when shift-key is depressed during keyboard selection
  _handleShiftKeyUpSelect: function() {
    var focusedOptionKey = this._getFocusedOptionKey();

    if (this.refs[focusedOptionKey]) {
      this._selectAllFromOptionRefToLastSelected(this.refs[focusedOptionKey].props['data-option-index']);
    }
  },

  // return the boolean used to determine whether an option should have the 'r-ss-selected' class
  _isCurrentlySelected: function(dataItem) {
    if (!_.isArray(this.state.value)) {
      return _.isEqual(this.state.value, dataItem);
    }
    return !!(_.findWhere(this.state.value, dataItem));
  },

  // tags and mutiple both provide multi-select behavior.  Returns true if either is set to true
  _isMultiSelect: function() {
    return this.props.multiple || this.props.tags;
  },

  // render option list-items based on a provided **customOptionTemplateFunction** function
  _mapDataToCustomTemplateMarkup: function(data, indexStart) {
    var self = this;

    return _.map(data, function(dataOption, index) {
      index = indexStart + index;

      var itemKey = "drop_li_" + dataOption[self.state.valueKey],
          indexRef = 'option_' + index,
          customOptionMarkup = self.props.customOptionTemplateFunction(dataOption),
          classes = classNames('r-ss-dropdown-option', {
            'r-ss-selected': self._isCurrentlySelected(dataOption)
          });

      return (
        <li ref={indexRef} tabIndex="0" data-option-index={index} className={classes} key={itemKey} data-option-value={dataOption[self.state.valueKey]} onClick={self._selectItemOnOptionClick.bind(null, dataOption[self.state.valueKey])} role="menuitem">
          {customOptionMarkup}
        </li>);
    });
  },

  // render option list-items based on the default template
  _mapDataToDefaultTemplateMarkup: function(data, indexStart) {
    var self = this;

    return _.map(data, function(dataOption, index) {
      index = indexStart + index;
      var itemKey = "drop_li_" + dataOption[self.state.valueKey],
          indexRef = 'option_' + index,
          classes = classNames('r-ss-dropdown-option', {
            'r-ss-selected': self._isCurrentlySelected(dataOption)
          });
      return (
        <li ref={indexRef} tabIndex="0" data-option-index={index} className={classes} key={itemKey} data-option-value={dataOption[self.state.valueKey]} onClick={self._selectItemOnOptionClick.bind(null, dataOption[self.state.valueKey])} role="menuitem">
          {dataOption[self.state.labelKey]}
        </li>);
    });
  },

  // determines next focusedId prior to updateFocusedId call
  _moveFocusDown: function() {
    var nextId;
    if (_.isUndefined(this.state.focusedId)) {
      if (this.props.searchable) {
        nextId = this.SEARCH_FOCUS_ID;
      } else {
        nextId = 0;
      }
    } else {
      nextId = (this.lastOptionId === this.state.focusedId) ? this.lastOptionId : this.state.focusedId + 1;
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

  // return boolean to determine if we have already received data from the **ajaxDataSource** function
  _needsAjaxFetch: function() {
    return !_.isArray(this.state.data) && this.props.ajaxDataSource;
  },

  // down key handler
  _onDownKey: function() {
    this._openedOnKeypress();
    this._moveFocusDown();
  },

  // end key handler
  _onEndKey: function() {
    if (this.state.lastOptionId) {
      this._updateFocusedId(this.state.lastOptionId);
    }
  },

  // enter key handler,
  // opens control when closed,
  // otherwise makes selection
  _onEnterKey: function(event) {
    if (!this._openedOnKeypress()) {

      var focusedOptionKey = this._getFocusedOptionKey();

      if (this.refs[focusedOptionKey]) {
        var optionValue = this.refs[focusedOptionKey].props['data-option-value'],
            isAdditionalOption = (this._isMultiSelect() && (event.ctrlKey || event.metaKey));
        this._selectItemByValues(optionValue, isAdditionalOption);
      }
    }
  },

  // escape key handler, closes the dropdown
  _onEscKey: function() {
    this._closeOnKeypress();
  },

  // home key handler, focuses the controls main element
  _onHomeKey: function() {
    this._updateFocusedId(0);
  },

  // mouse move handler used when **pageFetch** is set, will fire the pageFetch function if user has srolled sufficiently far in the dropdown
  _onMouseMove: function() {
    // do not fetch page if searching or already loading data
    if (this.refs.loader || this.state.searchString || this.state.pageFetchingComplete) {
      return;
    }

    var wrap = this.refs.scrollWrap.getDOMNode();

    if ((wrap.scrollTop + wrap.offsetHeight) >= wrap.scrollHeight) {
      this.setState({
        isFetchingPage: true
      }, this._fetchNextPage);
    }
  },

  // up key handler
  _onUpKey: function() {
    this._moveFocusUp();
  },

  // open the dropdown, return true if opening,
  // return value (boolean) is used in keyUp handlers to alternate behaviors based on open state
  _openedOnKeypress: function() {
    if (!this.state.isOpen) {
      this.toggleDropdown();
      return true;
    }
    return false;
  },

  // remove a selected tag on keyUp
  _removeTagKeyPress: function(value, event) {
    event.preventDefault();
    event.stopPropagation();

    var isEnterKey = event.which === this.keymap.enter,
        isSpaceKey = event.which === this.keymap.space;

    if (isEnterKey || isSpaceKey) {
      this._removeTagClick(value, event); // delegate to click handler
    }
  },

  // remove a selected tag on click
  _removeTagClick: function(value, event) {
    event.preventDefault();
    event.stopPropagation();

    var self = this;
    this.setState({
      value: _.reject(this.state.value, function(tag) {
              return tag[self.state.valueKey] === value[self.state.valueKey];
            })
    });
  },

  // used by shift-selection functions, determine a range of options to select from clicked item backwards to closest r-ss-selected
  _selectAllFromOptionRefToLastSelected: function(optionIndex) {
    var self = this,
        optionsToSelect = [],
        valuesToSelect;

    for (var i = (optionIndex); i >= 0; i--) {
      var refString = 'option_' + i,
          option = this.refs[refString];

      if (option.props.className.match(/r-ss-selected/)) {
        break;
      } else {
        optionsToSelect.push(option.props['data-option-value']);
      }

    }

    valuesToSelect = _.reject(this.state.data, function(item) {
                       return optionsToSelect.indexOf(item[self.state.valueKey]) === -1;
                     });

    this._selectItemByValues(valuesToSelect);
  },

  // handle selection of an option or array of options
  // close dropdown on state callback if not selecting additional options in a multi-select control
  _selectItemByValues: function(value, isAdditionalOption) {
   var objectValues = this._findArrayOfOptionDataObjectsByValue(value);

    if (this.props.tags || (isAdditionalOption && this.state.value)) {
      objectValues = this.state.value.concat(objectValues);
    }

    var outputValue = this._isMultiSelect() ? objectValues : _.first(objectValues);
    this.props.onChange(outputValue);

    if (isAdditionalOption) {
      this.setState({
        value: objectValues
      });
    } else {
      this.setState({
        value: objectValues
      }, this._closeOnKeypress);
    }
  },

  // handle option-click (ctrl or meta keys) when selecting additional options in a multi-select control
  _selectItemOnOptionClick: function(value, event) {
    if (this._isMultiSelect() && event.shiftKey) {
      this._handleShiftSelect(value, event);
      return;
    }
    var isAdditionalOption = (this._isMultiSelect() && (event.ctrlKey || event.metaKey));
    this._selectItemByValues(value, isAdditionalOption);
  },

  // set focus id to SEARCH_FOCUS_ID constant value
  _setFocusIdToSearch: function() {
    this.setState({
      focusedId: this.SEARCH_FOCUS_ID
    });
  },

  // sets the current focused id,
  // or closes the dropdown if id is undefined
  _updateFocusedId: function(id) {
    var self = this;

    this.setState({
      focusedId: id
    }, function() {
      if (_.isUndefined(id)) {
        self._closeOnKeypress();
        return;
      }
    });
  }

});

module.exports = ReactSuperSelect;
