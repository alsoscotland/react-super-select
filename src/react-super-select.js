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
    customClassName: React.PropTypes.string,
    customGroupHeadingClass: React.PropTypes.string,
    customSearchIconClass: React.PropTypes.string,
    customLoaderClass: React.PropTypes.string,
    customTagClass: React.PropTypes.string,

    // MAIN onChange HANDLER
    onChange: React.PropTypes.func.isRequired,

    // DROPDOWN DATA-related PROPS
    ajaxDataSource: React.PropTypes.func,
    dataSource: React.PropTypes.arrayOf(React.PropTypes.object),
    optionLabelKey: React.PropTypes.string,
    optionValueKey: React.PropTypes.string, // value this maps to should be unique in data source
    pageFetch: React.PropTypes.func,

    // Grouping functionality
    groupBy: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func,
            React.PropTypes.object
          ]),
    customGroupHeadingTemplateFunction: React.PropTypes.func,

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
    return {
      data: this.props.dataSource,
      isOpen: false,
      focusedId: undefined,
      labelKey: this.props.optionLabelKey || 'name',
      lastOptionId: (_.isArray(this.props.dataSource) && (this.props.dataSource.length > 0)) ? this.props.dataSource.length - 1 : undefined,
      searchString: undefined,
      value: [],
      valueKey: this.props.optionValueKey || 'id'
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

  _fetchDataViaAjax: function() {
    var self = this;
    this.props.ajaxDataSource().then(function(optionDataFromAjax) {
      var data = _.isArray(optionDataFromAjax) ? optionDataFromAjax : [];
      self.setState({
        data: data
      });
    });
  },

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

  _filterDataBySearchString: function(data) {
    var filterFunction = _.isFunction(this.props.customFilterFunction) ? this.props.customFilterFunction : this._defaultSearchFilter;
    return _.filter(data, filterFunction);
  },

  _findArrayOfOptionDataObjectsByValue: function(value) {
    var self = this,
        valuesArray = _.isArray(value) ? _.pluck(value, this.state.valueKey) : [value];
    return _.reject(this.state.data, function(item) {
      return !_.contains(valuesArray, item[self.state.valueKey]);
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
      return this._getTagsDisplayMarkup();
    }
  },

  _getDataSource: function() {
    var data = _.isArray(this.state.data) ? this.state.data : [];
    if (_.isString(this.state.searchString)) {
      data = this._filterDataBySearchString(data);
    }

    if (this.props.groupBy) {
      data = _.groupBy(data, this.props.groupBy);
      // enable simple sorting of groupBy keys below?
      // var sortedData = {},
      //     sortedKeys = _.keys(data).sort();
      // _.each(sortedKeys, function(key) {
      //   sortedData[key] = data[key];
      // });
      // data = sortedData;
    }

    return data;
  },

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

  _getFocusedOptionKey: function() {
    return 'option_' + this.state.focusedId;
  },

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
        return value[self.state.labelKey];
      }
    });
    return markup;
  },

  _getLoadingMarkup: function() {
    var loaderClasses = this.props.customLoaderClass ? "r-ss-loader " + this.props.customLoaderClass : "r-ss-loader";
    return (<span ref="loader" className={loaderClasses}></span>);
  },

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

  _getPagingLi: function() {
    return(<li key="page_loading" className="r-ss-page-fetch-indicator" tabIndex="-1">
            {this._getLoadingMarkup()}
          </li>);
  },

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

  _getTagsDisplayMarkup: function() {
    var self = this;
    var markup = _.map(this.state.value, function(value) {
      return self._getTagMarkup(value);
    });
    return markup;
  },

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

  _getTemplatedOptions: function(data, indexStart) {
    indexStart = indexStart || 0;
    var options = _.isFunction(this.props.customOptionTemplateFunction) ? this._mapDataToCustomTemplateMarkup(data, indexStart) : this._mapDataToDefaultTemplateMarkup(data, indexStart);

    if (options.length === 0) {
      options = this._getNoResultsMarkup();
    }

    return options;
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

  _handleShiftSelect: function(value, event) {
    var optionIndex = parseInt(event.currentTarget.getAttribute('data-option-index'), 10);
    if (optionIndex === 0) {
      return;
    }
    this._selectAllFromOptionRefToLastSelected(optionIndex);
  },

  _handleShiftKeyUpSelect: function() {
    var focusedOptionKey = this._getFocusedOptionKey();

    if (this.refs[focusedOptionKey]) {
      this._selectAllFromOptionRefToLastSelected(this.refs[focusedOptionKey].props['data-option-index']);
    }
  },

  _isCurrentlySelected: function(dataItem) {
    if (!_.isArray(this.state.value)) {
      return _.isEqual(this.state.value, dataItem);
    }
    return !!(_.findWhere(this.state.value, dataItem));
  },

  _isMultiSelect: function() {
    return this.props.multiple || this.props.tags;
  },

  _mapDataToCustomTemplateMarkup: function(data, indexStart) {
    var self = this;

    return _.map(data, function(dataOption, index) {
      index = indexStart + index;

      var itemKey = "drop_li_" + dataOption[self.state.valueKey],
          indexRef = 'option_' + index,
          customOptionMarkup = self.props.customOptionTemplateFunction(dataOption),
          classes = classNames('r-ss-dropdown-option', {
            'selected': self._isCurrentlySelected(dataOption)
          });

      return (
        <li ref={indexRef} tabIndex="0" data-option-index={index} className={classes} key={itemKey} data-option-value={dataOption[self.state.valueKey]} onClick={self._selectItemOnOptionClick.bind(null, dataOption[self.state.valueKey])} role="menuitem">
          {customOptionMarkup}
        </li>);
    });
  },

  _mapDataToDefaultTemplateMarkup: function(data, indexStart) {
    var self = this;

    return _.map(data, function(dataOption, index) {
      index = indexStart + index;
      var itemKey = "drop_li_" + dataOption[self.state.valueKey],
          indexRef = 'option_' + index,
          classes = classNames('r-ss-dropdown-option', {
            'selected': self._isCurrentlySelected(dataOption)
          });
      return (
        <li ref={indexRef} tabIndex="0" data-option-index={index} className={classes} key={itemKey} data-option-value={dataOption[self.state.valueKey]} onClick={self._selectItemOnOptionClick.bind(null, dataOption[self.state.valueKey])} role="menuitem">
          {dataOption[self.state.labelKey]}
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

  _needsAjaxFetch: function() {
    return !_.isArray(this.state.data) && this.props.ajaxDataSource;
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
            isAdditionalOption = (this._isMultiSelect() && (event.ctrlKey || event.metaKey));
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

  _removeTagKeyPress: function(value, event) {
    event.preventDefault();
    event.stopPropagation();

    var isEnterKey = event.which === this.keymap.enter,
        isSpaceKey = event.which === this.keymap.space;

    if (isEnterKey || isSpaceKey) {
      this._removeTagClick(value); // delegate to click handler
    }
  },

  _removeTagClick: function(value) {
    var self = this;
    this.setState({
      value: _.reject(this.state.value, function(tag) {
              return tag[self.state.valueKey] === value[self.state.valueKey];
            })
    });
  },

  _selectAllFromOptionRefToLastSelected: function(optionIndex) {
    var self = this,
        optionsToSelect = [],
        valuesToSelect;

    for (var i = (optionIndex); i >= 0; i--) {
      var refString = 'option_' + i,
          option = this.refs[refString];

      if (option.props.className.match(/selected/)) {
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

  _selectItemOnOptionClick: function(value, event) {
    if (this._isMultiSelect() && event.shiftKey) {
      this._handleShiftSelect(value, event);
      return;
    }
    var isAdditionalOption = (this._isMultiSelect() && (event.ctrlKey || event.metaKey));
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
