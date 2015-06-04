### JSX Markup
```html
<ReactSuperSelect placeholder="Make Your Selections" 
                  dataSource={testData} 
                  onChange={handlerExample}
                  initialValue={[testData[0], testData[1]]}
                  tags={true} />
```

### Properties

#### tags
```jsx
tags={true}
```

#### onChange
```js
var handlerExample = function(options) {
  var output = [];
  _.map(options, function(option){
    output = output.concat([
    'Multiselect Chosen Option = {\n',
    '\tid: ', option.id, '\n',
    '\tname: ', option.name, '\n',
    '\tsize: ', option.size, '\n\t};']);
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
