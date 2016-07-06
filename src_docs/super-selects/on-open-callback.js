var testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    onOpenExampleMarkdown = require('../markdown/js/examples/on-open-example').body;

var handlerExample = function(option) {
  if (!option) {
    exampleOutput('on_open_callback_example_output', "no option chosen");
    return;
  }

  var output = [
  'Option Item Chosen = {\n',
  '\tid: ', option.id, '\n',
  '\tname: ', option.name, '\n',
  '\tsize: ', option.size, '\n\t};'];
  exampleOutput('basic_example_output', output.join(''));
};

var onCloseDropdownHandler = function() {
  alert('React Super Select dropdown closed');
};

var onOpenDropdownHandler = function() {
  alert('React Super Select dropdown opened');
};

var onOpenCallbackExample = {

  nameAttr: "on_open_callback_example_output",
  displayName: "On Open Callback Example",

  props: {
    forceDefaultBrowserScrolling: true,
    onCloseDropdown: onCloseDropdownHandler,
    onOpenDropdown: onOpenDropdownHandler,
    placeholder: "Make a Selection",
    dataSource: testData,
    onChange: handlerExample
  },

  renderString: onOpenExampleMarkdown

};

module.exports = onOpenCallbackExample;
