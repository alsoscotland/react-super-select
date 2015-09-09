### JSX Markup
```html
<ReactSuperSelect customFilterFunction: customFilterExample,
                  placeholder="Pick an Item" 
                  searchPlaceholder="filter shop by category"
                  onChange={this.handlerExample}
                  customOptionTemplateFunction={groceryCartItemTemplate} 
                  dataSource={groceries} />
```

### Properties

#### onChange
```js
var groceryCartHandler = function(item) {
  console.log('Add To Cart: ', item.label, ' ', 'Price: ', item.price);
};
```

#### customFilterFunction
```js
var customFilterExample = function (option, index, collection, searchTerm) {
  return option.group.toLowerCase().indexOf(searchTerm) > -1;
};
```


#### dataSource (sample)
```js
var groceries = [
{
  id: 1,
  attributeName: "apple",
  label: "Apple",
  iconClass: "rss-grocery rss-grocery-apple",
  group: "Fruit",
  price: 0.79
},{
  id: 2,
  attributeName: "carrot",
  label: "Carrot",
  iconClass: "rss-grocery rss-grocery-carrot",
  group: "Vegetable",
  price: 0.21
}, ...
];
```
