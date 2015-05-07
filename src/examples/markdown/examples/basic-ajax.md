### JSX Markup
```html
<ReactSuperSelect placeholder="Make Your Selections" 
                  ajaxDataFetch={simulatedAjaxFetch} 
                  onChange={handlerExample} 
                  searchable={true} />
```

### Properties

#### ajaxDataFetch
*note* this is a function that simulates an ajax-call delay.  In an actual use-case you would use a real XHR function which returns a promise object
```jsx
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
```

#### onChange
```js
var handlerExample = function(option) {
  var output = [
    'Option Item Chosen = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};'];
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
