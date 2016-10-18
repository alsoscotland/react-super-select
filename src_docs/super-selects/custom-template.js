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

var _getHighlightedSearchLabel = function(item, search, searchRegex) {
  var labelMarkup = item.label.replace(searchRegex, '<span style="background-color: #f90;">' + search + '</span>');

  return React.DOM.span({ dangerouslySetInnerHTML: { __html: labelMarkup } });
};

var groceryCartItemTemplate = function(item, search) {
  if (console && console.info) {
    console.info('search term (%s) is provided for highlighting/modifying template output', search);
  }

  var itemClasses = classNames('grocery-item',
                               'example-' + item.group.toLowerCase()),
      iconClasses = classNames('grocery-icon',
                               'rss-grocery',
                              'rss-grocery-' + item.attributeName),
      labelMarkup = search ? _getHighlightedSearchLabel(item, search, new RegExp( search, 'i')) : item.label;

  return(
    <div className={itemClasses}>
      <span className={iconClasses}></span>
      <p>{labelMarkup} - {'$' + item.price.toFixed(2)}</p>
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
