var _ = require('lodash'),
    testData = require('./support/test-data.js'),
    exampleOutput = require('./support/example-output.js'),
    localizedMarkdown = require('../markdown/js/examples/localized').body;

var handlerExample = function(options) {
  var output = [];
  _.map(options, function(option){
    output = output.concat([
    'Localized Tags Chosen Option = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};\n']);
  });

  exampleOutput('localized_output', output.join(''));
};

var simulatedAjaxFetch= function() {
  var MOCK_AJAX_PER_PAGE = 10;
  var data = _.take(testData, MOCK_AJAX_PER_PAGE);
    // simulate a 2 second ajax fetch for collection data
    return {
      then: function(callback) {
        setTimeout(function() {
          callback(data);
        }, 2000);
      }
    };
};

var hasMorePagesExample = function(collection) {
  return collection.length < testData.length;
};

var previousPage = 0;

var simulatedPageFetch = function(collection) {
  var MOCK_AJAX_PER_PAGE = 10;
  previousPage = previousPage + 1;
  var sliceLocation = previousPage * MOCK_AJAX_PER_PAGE,
      data;
  if (sliceLocation < testData.length) {
    data = [];

    for (var i = sliceLocation; i < (sliceLocation + MOCK_AJAX_PER_PAGE); i++) {
      if (testData[i]) {
        data.push(testData[i]);
      }
    }
  } else {
    data = testData;
  }

  return {
    then: function(callback) {
      setTimeout(function() {
        callback(collection.concat(data));
      }, 1500);
    }
  };
};

var localizedExample = {

  nameAttr: "localized",
  displayName: "Localized",

  props: {
    ajaxDataFetch: simulatedAjaxFetch,
    hasMorePages: hasMorePagesExample,
    onChange: handlerExample,
    pageDataFetch: simulatedPageFetch,
    placeholder: "选择",
    ajaxErrorString: "错误",
    noResultsString: "无结果",
    searchPlaceholder: "搜索",
    searchable: true,
    tagRemoveLabelString: '删除标记',
    tags: true
  },

  renderString: localizedMarkdown

};

module.exports = localizedExample;
