var testData = require('../support/test-data.js'),
    exampleOutput = require('../support/example-output.js'),
    basicSearchableMarkdown = require('./markdown/js/basic-searchable').body;

var handlerExample = function(option) {
  var output = [
    'Searchable Option Item Chosen = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};'];
  exampleOutput('basic_example_output', output.join(''));
};

var basicSearchableExample = {

  nameAttr: "basic_searchable",
  displayName: "Basic Searchable",

  props: {
    placeholder: "Make a Selection",
    dataSource: testData,
    onChange: handlerExample,
    searchable: true
  },

  renderString: basicSearchableMarkdown

};

module.exports = basicSearchableExample;
