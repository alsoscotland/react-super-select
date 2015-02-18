var _ = require('lodash'),
    classNames = require('classnames'),
    React = require('react');

var ReactSuperSelect = React.createClass({

  propTypes: {
    placeholder: React.PropTypes.string,
    searchPlaceholder: React.PropTypes.string,
    noResultsString: React.PropTypes.string,
    onChange: React.PropTypes.func,
    externalMagnifierIconClasses: React.PropTypes.string,
    searchable: React.PropTypes.bool,

    remoteDataSourceFetchFunction: React.PropTypes.object,
    remoteDataSourceIsMultiPage: React.PropTypes.bool,

    dataSource: React.PropTypes.arrayOf(React.PropTypes.object),

    // simple option element props for hidden select
    optionValueKey: React.PropTypes.string,
    optionLabelKey: React.PropTypes.string,

    isMultiSelect: React.PropTypes.bool,
    optionsTemplate: React.PropTypes.object,
  },

  getInitialState: function() {
    return {
      isOpen: false
    };
  },

  _getHiddenSelectElement: function() {
    var optionsMarkup = this._mapDataToOptions();

    return(
      <select ref="hiddenSelect" className="r-ss-hidden" onChange={this.props.onChange}>
        {optionsMarkup}
      </select>
    );
  },


  _mapDataToOptions: function() {
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


  _getDropdownContent: function() {
    if (!this.state.isOpen) {
      return null;
    }

    var searchContent = this._getSearchContent();

    return(
      <div ref="dropdownContent" className="r-ss-dropdown">
        {searchContent}
      </div>
    );
  },

  _getSearchContent: function() {
    if (!this.props.searchable) {
      return null;
    }
    return(
      <div className="r-ss-search-wrap">
        <input ref="searchInput" placeholder={this.props.searchPlaceholder} />
        <button className="r-ss-button"><i className="r-ss-magnifier">search</i></button>
      </div>
    );
  },

  toggleDropdown: function() {
    this.setState({
      'isOpen': !this.state.isOpen
    });
  },

  render: function() {
    var hiddenSelect = this._getHiddenSelectElement(),
        dropdownContent = this._getDropdownContent(),
        caratClass = classNames('carat', {
          'down': !this.state.isOpen,
          'up': this.state.isOpen
        });

    return (
      <div className="r-ss-wrap">
        <div ref="triggerDiv" className="r-ss-trigger" onClick={this.toggleDropdown}>
          <input ref="valueDisplay" readOnly="true" placeholder={this.props.placeholder} />
          <span ref="carat" className={caratClass}> </span>
        </div>
        {hiddenSelect}
        {dropdownContent}
    </div>);
  }

});

module.exports = ReactSuperSelect;
