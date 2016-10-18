var React = require('react'),
    classNames = require('classnames'),
    groceries = require('./support/groceries.js'),
    exampleOutput = require('./support/example-output.js'),
    customSelectedValueTemplateMarkdown = require('../markdown/js/examples/custom-selected-value-template').body;

var handlerExample = function(option) {

  if (!option) {
    exampleOutput('custom_selected_value_template', "no option chosen");
    return;
  }

  var output = [
    'Add To Cart: ',
    option.label,
    '\nPrice: ',
    option.price];
  exampleOutput('custom_selected_value_template', output.join(''));
};

var selectedItemsTemplate = function(controlSelectedValue) {
  if (console && console.info) {
    console.info('selected value: (%s)', controlSelectedValue);
  }

  return(
    <div>
      {controlSelectedValue.length} item(s) selected
    </div>);
};

var customSelectedValueTemplateExample = {

  nameAttr: "custom_selected_value_template",
  displayName: "Custom Selected Value Template Example",

  props: {
    customSelectedValueTemplateFunction: selectedItemsTemplate,
    dataSource: groceries,
    multiple: true,
    onChange: handlerExample,
    optionLabelKey: 'label',
    placeholder: "Pick an Item",
    searchable: true,
    searchPlaceholder: "Search Shop"
  },

  renderString: customSelectedValueTemplateMarkdown

};

module.exports = customSelectedValueTemplateExample;
