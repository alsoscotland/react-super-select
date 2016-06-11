var testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    openOnMountMarkdown = require('../markdown/js/examples/open-on-mount').body;

var handlerExample = function(option) {
  if (!option) {
    exampleOutput('open_on_mount', "no option chosen");
    return;
  }

  var output = [
  'Option Item Chosen = {\n',
  '\tid: ', option.id, '\n',
  '\tname: ', option.name, '\n',
  '\tsize: ', option.size, '\n\t};'];
  exampleOutput('open_on_mount', output.join(''));
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

var openOnMountExample = {

  nameAttr: "open_on_mount",
  displayName: "Open On Mount",

  props: {
    placeholder: "Choose An Option",
    ajaxDataFetch: simulatedAjaxFetch,
    onChange: handlerExample,
    openOnMount: true,
    searchable: true
  },

  renderString: openOnMountMarkdown

};

module.exports = openOnMountExample;
