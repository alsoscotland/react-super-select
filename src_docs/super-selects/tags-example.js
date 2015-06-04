var _ = require('lodash'),
    testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    tagsMarkdown = require('../markdown/js/examples/tags-example').body;

var handlerExample = function(options) {
  var output = [];
  _.map(options, function(option){
    output = output.concat([
    'Tags Chosen Option = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};\n']);
  });

  exampleOutput('tags_example_output', output.join(''));
};

var tagsExample = {

  nameAttr: "tags_example",
  displayName: "Tags",

  props: {
    placeholder: "Make Your Selections",
    dataSource: testData,
    initialValue: [testData[0], testData[1]],
    onChange: handlerExample,
    tags: true
  },

  renderString: tagsMarkdown

};

module.exports = tagsExample;
