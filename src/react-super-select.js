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
    onChange: React.PropTypes.func,
    externalSearchIconClass: React.PropTypes.string,
    searchable: React.PropTypes.bool,

    remoteDataSourceFetchFunction: React.PropTypes.object,
    remoteDataSourceIsMultiPage: React.PropTypes.bool,

    dataSource: React.PropTypes.arrayOf(React.PropTypes.object),

    // simple option element props for hidden select
    optionValueKey: React.PropTypes.string,
    optionLabelKey: React.PropTypes.string,

    isMultiSelect: React.PropTypes.bool,
    optionTemplate: React.PropTypes.object,
  },

  getInitialState: function() {
    return {
      isOpen: false,
      value: undefined
    };
  },

  keymap: {
    'down': 40,
    'up': 38,
    'esc': 27,
    'enter': 13
  },

  _getHiddenSelectElement: function() {
    var optionsMarkup = this._mapDataToHiddenSelectOptions();

    return(
      <select ref="hiddenSelect" className="r-ss-hidden" onChange={this.props.onChange}>
        {optionsMarkup}
      </select>
    );
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

  _mapDataToDefaultOptionMarkup: function() {
    var labelKey = this.props.optionLabelKey || 'name',
        valueKey = this.props.optionValueKey || 'id',
        data = this.props.dataSource || [],
        self = this;

    return _.map(data, function(dataOption) {
      //TODO stream icons, template-capable select control needed
      var itemKey = "drop_li_" + dataOption[valueKey];
      return (
        <li className="r-ss-dropdown-option" key={itemKey} onClick={self._selectItem}>
          {dataOption[labelKey]}
        </li>);
    });
  },

  _selectItem: function(event) {
    debugger;
  },

  _getDropdownContent: function() {
    if (!this.state.isOpen) {
      return null;
    }

    var searchContent = this._getSearchContent(),
        optionContent = this._mapDataToDefaultOptionMarkup();
    return(
      <div ref="dropdownContent" className="r-ss-dropdown">
        {searchContent}
        <ul className="r-ss-dropdown-options" ref="dropdownOptionsList">
          {optionContent}
        </ul>
      </div>
    );
  },

  _getSearchContent: function() {
    if (!this.props.searchable) {
      return null;
    }

    var magnifierClass = this.props.externalSearchIconClass ? this.props.externalSearchIconClass : "r-ss-magnifier";

    return(
      <div className="r-ss-search-wrap">
        <div className="r-ss-search-inner">
          <input ref="searchInput" placeholder={this.props.searchPlaceholder} />
          <button className="r-ss-button"><i className={magnifierClass}>search</i></button>
        </div>
      </div>
    );
  },

  _handleKeyUp: function(event) {
    switch(event.which) {
      case this.keymap.down:
        if (!this.state.isOpen) {
          this.toggleDropdown();
        }
        break;
    }
  },

  toggleDropdown: function() {
    this.setState({
      'isOpen': !this.state.isOpen
    });
  },

  render: function() {
    var hiddenSelect = this._getHiddenSelectElement(),
        dropdownContent = this._getDropdownContent(),
        valueDisplayClass,
        triggerDisplayContent,
        caratClass = classNames('carat', {
          'down': !this.state.isOpen,
          'up': this.state.isOpen
        });
    triggerDisplayContent = this.state.value ? this.state.value : this.props.placeholder;
    valueDisplayClass = classNames('r-ss-value-display', {
      'r-ss-placeholder': !this.state.value,
    });

    return (
      <div className="r-ss-wrap">
        <div ref="triggerDiv" className="r-ss-trigger" onClick={this.toggleDropdown} onKeyUp={this._handleKeyUp}>
          <a className="r-ss-mock-input" tabIndex="0" aria-label={this.props.placeholder}>
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
