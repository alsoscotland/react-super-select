var _ = require('lodash'),
    testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    multiselectMarkdown = require('../markdown/js/examples/multiselect').body;

var handlerExample = function(options) {
  var output = [];
  _.map(options, function(option){
    output = output.concat([
    'Multiselect Chosen Option = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};\n']);
  });

  exampleOutput('multiselect_output', output.join(''));
};

var multiselectExample = {

  nameAttr: "multiselect",
  displayName: "Multiselect",

  props: {
    placeholder: "Make Your Selections",
    dataSource: testData,
    onChange: handlerExample,
    multiple: true
  },

  renderString: multiselectMarkdown

};

module.exports = multiselectExample;
