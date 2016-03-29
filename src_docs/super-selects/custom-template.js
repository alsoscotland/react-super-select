var React = require('react'),
    classNames = require('classnames'),
    groceries = require('./support/groceries.js'),
    exampleOutput = require('./support/example-output.js'),
    customTemplateMarkdown = require('../markdown/js/examples/custom-template').body;

var handlerExample = function(option) {

  if (!option) {
    exampleOutput('custom_template_output', "no option chosen");
    return;
  }

  var output = [
    'Add To Cart: ',
    option.label,
    '\nPrice: ',
    option.price];
  exampleOutput('custom_template_output', output.join(''));
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

var customTemplateExample = {

  nameAttr: "custom_template",
  displayName: "Custom Template Example",

  props: {
    customOptionTemplateFunction: groceryCartItemTemplate,
    dataSource: groceries,
    onChange: handlerExample,
    optionLabelKey: 'label',
    placeholder: "Pick an Item",
    searchable: true,
    searchPlaceholder: "Search Shop"
  },

  renderString: customTemplateMarkdown

};

module.exports = customTemplateExample;
