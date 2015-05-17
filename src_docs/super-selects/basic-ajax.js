var testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    basicAjaxMarkdown = require('../markdown/js/examples/basic-ajax').body;

var handlerExample = function(option) {
  var output = [
    'Option Item Chosen = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};'];
  exampleOutput('basic_ajax_output', output.join(''));
};

var simulatedAjaxFetch= function() {
  // simulate a 2 second ajax fetch for collection data
  return {
    then: function(callback) {
      setTimeout(function() {
        callback(testData);
      }, 2000);
    }
  };
};

var basicAjaxExample = {

  nameAttr: "basic_ajax",
  displayName: "Basic Ajax",

  props: {
    placeholder: "Choose An Option",
    ajaxDataFetch: simulatedAjaxFetch,
    onChange: handlerExample,
    searchable: true
  },

  renderString: basicAjaxMarkdown

};

module.exports = basicAjaxExample;
