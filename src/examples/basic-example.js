var testData = require('../support/test-data.js'),
    exampleOutput = require('../support/example-output.js'),
    basicExampleMarkdown = require('./markdown/js/basic-example').body;

var handlerExample = function(option) {
  var output = [
    'Option Item Chosen = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};'];
  exampleOutput('basic_example_output', output.join(''));
};

var basicExample = {

  nameAttr: "basic_example",
  displayName: "Basic Example",

  props: {
    placeholder: "Make a Selection",
    dataSource: testData,
    onChange: handlerExample
  },

  renderString: basicExampleMarkdown

};

module.exports = basicExample;
