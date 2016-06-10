var React = require('react'),
    testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    basicSearchableMarkdown = require('../markdown/js/examples/basic-searchable').body;

var handlerExample = function(option) {
  if (!option) {
    exampleOutput('basic_searchable_output', "no option chosen");
    return;
  }

  var output = [
  'Option Item Chosen = {\n',
  '\tid: ', option.id, '\n',
  '\tname: ', option.name, '\n',
  '\tsize: ', option.size, '\n\t};'];
  exampleOutput('basic_searchable_output', output.join(''));
};

var basicSearchableExample = {

  nameAttr: "basic_searchable",
  displayName: "Basic Searchable",

  props: {
    placeholder: "Make a Selection",
    clearSearchOnSelection: true,
    dataSource: testData,
    onChange: handlerExample,
    searchable: true
  },

  renderString: basicSearchableMarkdown

};

module.exports = basicSearchableExample;
