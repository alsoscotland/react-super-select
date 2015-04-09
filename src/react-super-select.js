var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

// test data call
// http://tumblr.tastefullyoffensive.com/api/read/json?filter=text&type=text

var ReactSuperSelect = React.createClass({

  propTypes: {

    // BOOLEAN OPTIONS
    multiple: React.PropTypes.bool,
    searchable: React.PropTypes.bool,
    tags: React.PropTypes.bool,

    // CSS CLASS / STYLING SUPPORT
    externalSearchIconClass: React.PropTypes.string,
    // customClass: React.PropTypes.string, // TODO

    // MAIN onChange HANDLER
    onChange: React.PropTypes.func.isRequired,

    // DROPDOWN DATA-related PROPS
    dataSource: React.PropTypes.arrayOf(React.PropTypes.object),
    optionLabelKey: React.PropTypes.string,
    optionValueKey: React.PropTypes.string,

    // AJAX-RELATED FUNCTION HANDLERS
    // remoteDataSourceFetchFunction: React.PropTypes.object,// TODO
    // remoteDataSourceIsMultiPage: React.PropTypes.bool, // TODO ?

    // RENDERING (ITERATOR) FUNCTIONS
    customFilterFunction: React.PropTypes.func,
    customOptionTemplateFunction: React.PropTypes.func,

    // LOCALIZATION STRINGS
    noResultsString: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    searchPlaceholder: React.PropTypes.string
  },

  // do not use state because we do not want re-render when focusing
  SEARCH_FOCUS_ID: -1,

  getInitialState: function() {
    var data = this.props.dataSource || [];
    return {
      isOpen: false,
      focusedId: undefined,
      lastOptionId: (data.length > 0) ? data.length - 1 : undefined,
      searchString: undefined,
      value: []
    };
  },

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

  componentWillReceiveProps: function(nextProps) {
    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)) {
      var data = nextProps.dataSource || [];
      this.setState({
        focusedId: undefined,
        lastOptionId: (data.length > 0) ? data.length - 1 : undefined
      });
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevState.focusedId === this.state.focusedId) {
      return;
    }
    this._focusCurrentFocusedId();
  },

  render: function() {
    var dropdownContent = this._getDropdownContent(),
        valueDisplayClass,
        triggerDisplayContent,
        triggerClasses,
        caratClass = classNames('carat', {
          'down': !this.state.isOpen,
          'up': this.state.isOpen
        });
    triggerClasses = classNames('r-ss-trigger', {
      'r-ss-open': this.state.isOpen
    });
    triggerDisplayContent = this.state.value.length ? this._generateValueDiplay() : this.props.placeholder;
    valueDisplayClass = classNames('r-ss-value-display', {
      'r-ss-placeholder': this.state.value.length < 1,
    });

    return (
      <div className="r-ss-wrap">
        <div ref="triggerDiv" className={triggerClasses} onClick={this.toggleDropdown} onKeyUp={this._handleKeyUp} aria-haspopup="true">
          <a ref="triggerAnchor" className="r-ss-mock-input" tabIndex="0" aria-label={this.props.placeholder}>
            <span className={valueDisplayClass} ref="valueDisplay">{triggerDisplayContent}</span>
            <span ref="carat" className={caratClass}> </span>
          </a>
        </div>
        {dropdownContent}
      </div>);
  },

  toggleDropdown: function() {
    this.setState({
      'isOpen': !this.state.isOpen
    });
  },





  _closeOnKeypress: function() {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false,
        focusedId: undefined
      }, this._focusTrigger);
      return true;
    }
  },

  _defaultSearchFilter: function(option) {
    var search = this.state.searchString.toLowerCase();
    if (!_.isString(option.name)) {
      return false;
    }
    return option.name.toLowerCase().indexOf(search) > -1;
  },

  _filterDataBySearchString: function(data) {
    var filterFunction = _.isFunction(this.props.customFilterFunction) ? this.props.customFilterFunction : this._defaultSearchFilter;
    return _.filter(data, filterFunction);
  },

  _findArrayOfOptionDataObjectsByValue: function(value) {
    var valueKey = this.props.optionValueKey || 'id';
    value = _.isArray(value) ? _.pluck(value, valueKey) : [value];
    return _.reject(this.props.dataSource, function(item) {
      return !_.contains(value, item[valueKey]);
    });
  },

  _focusCurrentFocusedId: function() {
    if (this.state.focusedId < 0) {
      this._focusSearch();
      return;
    }

    this._focusDOMOption();
  },

  _focusDOMOption: function() {
    var optionRef = this._getFocusedOptionKey();
    if (this.refs[optionRef]) {
      if (_.isFunction(this.refs[optionRef].getDOMNode().focus)) {
        this.refs[optionRef].getDOMNode().focus();
      }
    }
  },

  _focusSearch: function() {
    if (this.refs.searchInput) {
      this.refs.searchInput.getDOMNode().focus();
    }
  },

  _focusTrigger: function() {
    if (this.refs.triggerAnchor) {
      this.refs.triggerAnchor.getDOMNode().focus();
    }
  },

  _generateValueDiplay: function() {
    if (!this.props.tags) {
      return this._getNormalDisplayMarkup();
    } else {
      this._getTagDisplayMarkup();
    }
  },

  _getDataSource: function() {
    var data = this.props.dataSource || [];
    if (_.isString(this.state.searchString)) {
      data = this._filterDataBySearchString(data);
    }
    return data;
  },

  _getDropdownContent: function() {
    if (!this.state.isOpen) {
      return null;
    }

    var searchContent = this._getSearchContent(),
        optionContent = this._getOptionsMarkup();
    return(
      <div ref="dropdownContent" className="r-ss-dropdown" onKeyUp={this._handleKeyUp}>
        {searchContent}
        <div className="r-ss-options-wrap">
          <ul className="r-ss-dropdown-options" ref="dropdownOptionsList" aria-hidden={!this.state.isOpen} role="menubar">
            {optionContent}
          </ul>
        </div>
      </div>
    );
  },

  _getFocusedOptionKey: function() {
    return 'option_' + this.state.focusedId;
  },

  _getNoResultsMarkup: function() {
    var noResultsString = this.props.noResultsString ? this.props.noResultsString : 'No Results Available';
    return (<li className="r-ss-dropdown-option"><i ref="noResults">{noResultsString}</i></li>);
  },

  _getNormalDisplayMarkup: function() {
    var self = this;
    var markup = _.map(this.state.value, function(value) {
      if (self.props.customOptionTemplateFunction) {
        // render custom template if provided with a rendering function
        return self.props.customOptionTemplateFunction(value);
      } else {
        var labelKey = self.props.optionLabelKey || 'name';
        return value[labelKey];
      }
    });
    return markup;
  },

  _getOptionsMarkup: function() {
    var options = _.isFunction(this.props.customOptionTemplateFunction) ? this._mapDataToCustomTemplateMarkup() : this._mapDataToDefaultTemplateMarkup();

    if (options.length === 0) {
      options = this._getNoResultsMarkup();
    }

    return options;
  },

  _getSearchContent: function() {
    if (!this.props.searchable) {
      return null;
    }

    var magnifierClass = this.props.externalSearchIconClass ? this.props.externalSearchIconClass : "r-ss-magnifier";

    return(
      <div className="r-ss-search-wrap">
        <div className="r-ss-search-inner">
          <input ref="searchInput" placeholder={this.props.searchPlaceholder} onKeyUp={this._handleSearch} onClick={this._setFocusIdToSearch} defaultValue={this.state.searchString} />
          <i className={magnifierClass}>search</i>
        </div>
      </div>
    );
  },

  _getTagDisplayMarkup: function() {

  },

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
        this._onEnterKey(event);
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
        this._onEnterKey(event); // delegate to enter
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

  _handleSearch: function(event) {
    var searchString = event.target.value;
    this._handleSearchDebounced.call(this, searchString);
    this._handleKeyUp(event);
  },

  _handleSearchDebounced: _.debounce(function(search) {
    this.setState({
      searchString: search
    });
  }, 300),

  _isCurrentlySelected: function(dataItem) {
    if (!_.isArray(this.state.value)) {
      return _.isEqual(this.state.value, dataItem);
    }
    return !!(_.findWhere(this.state.value, dataItem));
  },

  _mapDataToCustomTemplateMarkup: function() {
    var valueKey = this.props.optionValueKey || 'id',
        data = this._getDataSource(),
        self = this;

    return _.map(data, function(dataOption, index) {
      var itemKey = "drop_li_" + dataOption[valueKey],
          indexRef = 'option_' + index,
          customOptionMarkup = self.props.customOptionTemplateFunction(dataOption),
          classes = classNames('r-ss-dropdown-option', {
            'selected': self._isCurrentlySelected(dataOption)
          });

      return (
        <li ref={indexRef} tabIndex="0" className={classes} key={itemKey} data-option-value={dataOption[valueKey]} onClick={self._selectItemOnOptionClick.bind(null, dataOption[valueKey])} role="menuitem">
          {customOptionMarkup}
        </li>);
    });
  },

  _mapDataToDefaultTemplateMarkup: function() {
    var labelKey = this.props.optionLabelKey || 'name',
        valueKey = this.props.optionValueKey || 'id',
        data = this._getDataSource(),
        self = this;

    return _.map(data, function(dataOption, index) {
      var itemKey = "drop_li_" + dataOption[valueKey],
          indexRef = 'option_' + index,
          classes = classNames('r-ss-dropdown-option', {
            'selected': self._isCurrentlySelected(dataOption)
          });
      return (
        <li ref={indexRef} tabIndex="0" className={classes} key={itemKey} data-option-value={dataOption[valueKey]} onClick={self._selectItemOnOptionClick.bind(null, dataOption[valueKey])} role="menuitem">
          {dataOption[labelKey]}
        </li>);
    });
  },

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

  _onDownKey: function() {
    this._openedOnKeypress();
    this._moveFocusDown();
  },

  _onEndKey: function() {
    if (this.state.lastOptionId) {
      this._updateFocusedId(this.state.lastOptionId);
    }
  },

  _onEnterKey: function(event) {
    if (!this._openedOnKeypress()) {

      var focusedOptionKey = this._getFocusedOptionKey();

      if (this.refs[focusedOptionKey]) {
        var optionValue = this.refs[focusedOptionKey].props['data-option-value'],
            isAdditionalOption = (this.props.multiple && (event.ctrlKey || event.metaKey));
        this._selectItemByValues(optionValue, isAdditionalOption);
      }
    }
  },

  _onEscKey: function() {
    this._closeOnKeypress();
  },

  _onHomeKey: function() {
    this._updateFocusedId(0);
  },

  _onSpaceKey: function() {
    this._openedOnKeypress();
  },

  _onUpKey: function() {
    this._moveFocusUp();
  },

  _openedOnKeypress: function() {
    if (!this.state.isOpen) {
      this.toggleDropdown();
      return true;
    }
    return false;
  },

  _selectItemByValues: function(value, isAdditionalOption) {
   var objectValues = this._findArrayOfOptionDataObjectsByValue(value);

    if (isAdditionalOption && this.state.value) {
      objectValues = this.state.value.concat(objectValues);
    }

    var outputValue = this.props.multiple ? objectValues : _.first(objectValues);
    this.props.onChange(outputValue);

    this.setState({
      value: objectValues
    }, this._closeOnKeypress);
  },

  _selectItemOnOptionClick: function(value, event) {
    var isAdditionalOption = (this.props.multiple && (event.ctrlKey || event.metaKey));
    this._selectItemByValues(value, isAdditionalOption);
  },

  _setFocusIdToSearch: function() {
    this.setState({
      focusedId: this.SEARCH_FOCUS_ID
    });
  },

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
