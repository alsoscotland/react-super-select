var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

// test data call
// http://tumblr.tastefullyoffensive.com/api/read/json?filter=text&type=text

var ReactSuperSelect = React.createClass({

  propTypes: {
    placeholder: React.PropTypes.string,
    searchPlaceholder: React.PropTypes.string,
    noResultsString: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
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
    optionTemplate: React.PropTypes.object,
  },

  // do not use state because we do not want re-render when focusing
  SEARCH_FOCUS_ID: -1,
  focusedId: undefined,
  lastOptionId: undefined,

  getInitialState: function() {
    return {
      isOpen: false,
      searchString: undefined,
      value: undefined
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
    // need to update focus tracking if dataSource changes
    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)) {
      var data = nextProps.dataSource || [];
      this.lastOptionId = (data.length > 0) ? data.length - 1 : undefined;
      this.focusedId = undefined;
    }
  },

  _closedOnKeypress: function() {
    if (this.state.isOpen) {
      this.focusedId = undefined;
      this.toggleDropdown();
      this._focusTrigger();
      return true;
    }
    return false;
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

  _findOptionDataObjectsByValue: function(value) {
    var valueKey = this.props.optionValueKey || 'id';

    value = _.isArray(value) ? _.pluck(value, valueKey) : [value];
    return _.reject(this.props.dataSource, function(item) {
      return !_.contains(value, item[valueKey]);
    });
  },

  _generateValueDiplay: function() {
    // if showing a single value
    if (_.isArray(this.state.value) && (this.state.value.length === 1)) {
      return this._getSingleValueDisplayMarkup();
    } else {
      // TODO - Tags mapping
    }
  },

  _getSingleValueDisplayMarkup: function() {
    if (this.props.customOptionsMapper) {
      // render custom template if provided with a rendering function
      return this.props.customOptionsMapper(this.state.value[0]);
    } else {
      var labelKey = this.props.optionLabelKey || 'name';
      return this.state.value[0][labelKey];
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

  _getHiddenSelectElement: function() {
    var optionsMarkup = this._mapDataToHiddenSelectOptions();

    return(
      <select ref="hiddenSelect" className="r-ss-hidden">
        {optionsMarkup}
      </select>
    );
  },

  _getOptionsMarkup: function() {
    var options = _.isFunction(this.props.customOptionsMapper) ? this._mapDataToCustomOptionMarkup() : this._mapDataToDefaultOptionMarkup();
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

  _handleKeyUp: function(event) {
    event.preventDefault();
    event.stopPropagation();
    switch(event.which) {
      case this.keymap.down:
        this._onDownKey();
        break;
      case this.keymap.enter:
        this._onEnterKey();
        break;
      case this.keymap.esc:
        this._onEscKey();
        break;
      case this.keymap.left: // delegate to up handler
        this._onUpKey();
        break;
      case this.keymap.right: // delegate to down handler
        this._onDownKey();
        break;
      case this.keymap.space:
        this._onSpaceKey();
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
    // need to get keyup events to top level of control DOM
    this._handleKeyUp(event);
  },

  _handleSearchDebounced: _.debounce(function(search) {
    this.setState({
      searchString: search
    });
  }, 300),

  _isCurrentlySelected: function(dataItem) {
    if (!_.isArray(this.state.value)) {
      return false;
    }
    return !!(_.findWhere(this.state.value, dataItem));
  },

  _mapDataToCustomOptionMarkup: function() {
    var valueKey = this.props.optionValueKey || 'id',
        data = this._getDataSource(),
        self = this;

    return _.map(data, function(dataOption, index) {
      var itemKey = "drop_li_" + dataOption[valueKey],
          indexRef = 'option_' + index,
          customOptionMarkup = self.props.customOptionsMapper(dataOption),
          classes = classNames('r-ss-dropdown-option', {
            'selected': self._isCurrentlySelected(dataOption)
          });
      return (
        <li ref={indexRef} tabIndex="0" className={classes} key={itemKey} data-option-value={dataOption[valueKey]} onClick={self._selectItemOnOptionClick} role="menuitem">
          {customOptionMarkup}
        </li>);
    });
  },

  _mapDataToDefaultOptionMarkup: function() {
    var labelKey = this.props.optionLabelKey || 'name',
        valueKey = this.props.optionValueKey || 'id',
        data = this._getDataSource(),
        self = this;

    return _.map(data, function(dataOption, index) {
      //TODO stream icons, template-capable select control needed
      var itemKey = "drop_li_" + dataOption[valueKey],
          indexRef = 'option_' + index,
          classes = classNames('r-ss-dropdown-option', {
            'selected': self._isCurrentlySelected(dataOption)
          });
      return (
        <li ref={indexRef} tabIndex="0" className={classes} key={itemKey} data-option-value={dataOption[valueKey]} onClick={self._selectItemOnOptionClick} role="menuitem">
          {dataOption[labelKey]}
        </li>);
    });
  },

  _mapDataToHiddenSelectOptions: function() {
    var labelKey = this.props.optionLabelKey || 'name',
        valueKey = this.props.optionValueKey || 'id',
        data = this.props.dataSource || [];

    return _.map(data, function(dataOption) {
      //TODO stream icons, template-capable select control needed
      return (
        <option key={dataOption[valueKey]} value={dataOption[valueKey]}>
          {dataOption[labelKey]}
        </option>);
    });
  },

  /* FOCUS Logic */
  _moveFocusDown: function() {
    var nextId;
    if (_.isUndefined(this.focusedId)) {
      if (this.props.searchable) {
        nextId = this.SEARCH_FOCUS_ID;
      } else {
        nextId = 0;
      }
    } else {
      nextId = (this.lastOptionId === this.focusedId) ? this.lastOptionId : this.focusedId + 1;
    }
    this._updateFocusedId(nextId);
  },

  _moveFocusUp: function() {
    var previousId;

    if (!_.isUndefined(this.focusedId) && (this.focusedId !== this.SEARCH_FOCUS_ID)) {
      if (this.focusedId === 0) {
        if (this.props.searchable) {
          previousId = this.SEARCH_FOCUS_ID;
        }
      } else {
        previousId = this.focusedId - 1;
      }
    }
    this._updateFocusedId(previousId);
  },

  _focusDOMOption: function() {
    var optionRef = this._getFocusedOptionKey();
    if (this.refs[optionRef]) {
      this.refs[optionRef].getDOMNode().focus();
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

  _getFocusedOptionKey: function() {
    return 'option_' + this.focusedId;
  },

  _updateFocusedId: function(id) {
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

  _onDownKey: function() {
    if (!this._openedOnKeypress()) {
      // move through selections if not just opening
      this._moveFocusDown();
    }
  },

  _onEnterKey: function() {
    if (!this._openedOnKeypress()) {
      var focusedOptionKey = this._getFocusedOptionKey();
      if (this.refs[focusedOptionKey]) {
        // TODO if tags, append to state.value array
        var optionValue = this.refs[focusedOptionKey].getDOMNode().dataset.optionValue;
        this._selectItemByValues(optionValue);
      }
    }
  },

  _onEscKey: function() {
    this._closedOnKeypress();
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

  // TODO _selectItemOnOptionClick test
  _selectItemOnOptionClick: function(event) {
    var value = event.currentTarget.dataset.optionValue;
    this._selectItemByValues(value);
  },

  _selectItemByValues: function(value) {
    var objectValues,
        select = this.refs.hiddenSelect;
    select.getDOMNode().value = value;
    objectValues = this._findOptionDataObjectsByValue(value);
    this.props.onChange(objectValues);
    this.setState({
      value: objectValues
    }, this._closedOnKeypress);
  },

  _setFocusIdToSearch: function() {
    this.focusedId = this.SEARCH_FOCUS_ID;
  },

  toggleDropdown: function() {
    this.setState({
      'isOpen': !this.state.isOpen
    }, function() {
      if (this.state.isOpen) {
        this._moveFocusDown();
      }
    });
  },

  render: function() {
    var hiddenSelect = this._getHiddenSelectElement(),
        dropdownContent = this._getDropdownContent(),
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
    triggerDisplayContent = this.state.value ? this._generateValueDiplay() : this.props.placeholder;
    valueDisplayClass = classNames('r-ss-value-display', {
      'r-ss-placeholder': !this.state.value,
    });

    return (
      <div className="r-ss-wrap">
        <div ref="triggerDiv" className={triggerClasses} onClick={this.toggleDropdown} onKeyUp={this._handleKeyUp} aria-haspopup="true">
          <a ref="triggerAnchor" className="r-ss-mock-input" tabIndex="0" aria-label={this.props.placeholder}>
            <span className={valueDisplayClass} ref="valueDisplay">{triggerDisplayContent}</span>
            <span ref="carat" className={caratClass}> </span>
          </a>
        </div>
        {hiddenSelect}
        {dropdownContent}
      </div>);
  }

});

module.exports = ReactSuperSelect;
