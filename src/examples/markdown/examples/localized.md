### JSX Markup
```html
<ReactSuperSelect ajaxDataFetch={simulatedAjaxFetch}
                  hasMorePages={hasMorePagesExample}
                  onChange={handlerExample}
                  pageDataFetch={simulatedPageFetch}
                  searchable={true}
                  tags={true}
                  placeholder="选择"
                  ajaxErrorString="错误"
                  noResultsString="无结果"
                  searchPlaceholder="搜索"
                  tagRemoveLabelString="删除标记" />
```

### Properties

####localization properties
```jsx
placeholder="选择"
ajaxErrorString="错误"
noResultsString="无结果"
searchPlaceholder="搜索"
tagRemoveLabelString="删除标记"
```

#### pageDataFetch
*note* this is a function that simulates an ajax-call delay.  In an actual use-case you would use a real XHR function which returns a promise object
```jsx
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
```

#### hasMorePages
```jsx
var hasMorePagesExample = function(collection) {
  return collection.length < testData.length;
};
```

#### ajaxDataFetch
*note* this is a function that simulates an ajax-call delay.  In an actual use-case you would use a real XHR function which returns a promise object
```jsx
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
```

#### onChange
```js
var handlerExample = function(option) {
  var output = [];
  _.map(options, function(option){
    output = output.concat([
    'Localized Tags Chosen Option = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};\n']);
  });
  console.log(output.join(''));
};
```

#### dataSource (sample)
```js
var testData = [
{
  "id": "5507c0528152e61f3c348d56",
  "name": "elit laborum et",
  "size": "Large"
},
{
  "id": "5507c0526305bceb0c0e2c7a",
  "name": "dolor nulla velit",
  "size": "Medium"
}, ...
];
```
