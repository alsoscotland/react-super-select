var React = require('react'),
    classNames = require('classnames'),
    groceries = require('./support/groceries.js'),
    exampleOutput = require('./support/example-output.js'),
    customFilterFunctionMarkdown = require('../markdown/js/examples/custom-filter-function').body;

var handlerExample = function(option) {

  if (!option) {
    exampleOutput('custom_filter_function_output', "no option chosen");
    return;
  }

  var output = [
    'Add To Cart: ',
    option.label,
    '\nPrice: ',
    option.price];
  exampleOutput('custom_filter_function_output', output.join(''));
};

var customFilter = function (option, index, collection, searchTerm) {
  return option.group.toLowerCase().indexOf(searchTerm) > -1;
};

var groceryCartItemTemplate = function(item) {
  var itemClasses = classNames('grocery-item',
                               'example-' + item.group.toLowerCase()),
      iconClasses = classNames('grocery-icon',
                               'rss-grocery',
                              'rss-grocery-' + item.attributeName);

  return(
    <div className={itemClasses}>
      <span className={iconClasses}></span>
      <p>{item.label} - {'$' + item.price.toFixed(2)}</p>
    </div>);
};

var customFilterExample = {

  nameAttr: "custom_filter_function",
  displayName: "Custom Filter Function Example",

  props: {
    customFilterFunction: customFilter,
    customOptionTemplateFunction: groceryCartItemTemplate,
    dataSource: groceries,
    onChange: handlerExample,
    optionLabelKey: 'label',
    placeholder: "Pick an Item",
    searchable: true,
    searchPlaceholder: "filter shop by category"
  },

  renderString: customFilterFunctionMarkdown

};

module.exports = customFilterExample;
