var React = require('react'),
    classNames = require('classnames'),
    groceries = require('./support/groceries.js'),
    exampleOutput = require('./support/example-output.js'),
    groupByMarkdown = require('../markdown/js/examples/group-by').body;

var handlerExample = function(option) {
  var output = [
    'Add To Cart: ',
    option.label,
    '\nPrice: ',
    option.price];
  exampleOutput('group_by_output', output.join(''));
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

var groupByExample = {

  nameAttr: "group_by",
  displayName: "Grouped Options Example",

  props: {
    customOptionTemplateFunction: groceryCartItemTemplate,
    dataSource: groceries,
    onChange: handlerExample,
    optionLabelKey: "label",
    placeholder: "Pick an Item",
    searchable: true,
    searchPlaceholder: "Search Shop",
    groupBy: "group"
  },

  renderString: groupByMarkdown

};

module.exports = groupByExample;
