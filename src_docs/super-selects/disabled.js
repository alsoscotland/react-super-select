var testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    disabledExampleMarkdown = require('../markdown/js/examples/disabled-example').body;

var handlerExample = function(option) {
  if (!option) {
    exampleOutput('disabled_example_output', "no option chosen");
    return;
  }

  var output = [
  'Option Item Chosen = {\n',
  '\tid: ', option.id, '\n',
  '\tname: ', option.name, '\n',
  '\tsize: ', option.size, '\n\t};'];
  exampleOutput('disabled_example_output', output.join(''));
};

var disabledExample = {

  nameAttr: "disabled_example",
  displayName: "Disabled Example",

  props: {
    disabled: true,
    placeholder: "Make a Selection",
    dataSource: testData,
    onChange: handlerExample
  },

  renderString: disabledExampleMarkdown

};

module.exports = disabledExample;
