### JSX Markup
```html
<ReactSuperSelect customOptionTemplateFunction: groceryCartItemTemplate,
                  dataSource={groceries}
                  onChange={this.groceryCartHandler}
                  optionLabelKey="label"
                  placeholder="Pick an Item"
                  searchable={true}
                  searchPlaceholder="Search shop"
                  groupBy="group" />
```

### Properties
#### groupBy
Using the simplest form of lodash's groupBy, we pass the key name for the option data object.  The options will be sorted by the values found for that 
key across the dataSource collection.
```jsx
groupBy="group"
```


#### customOptionTemplateFunction
```js
var groceryCartItemTemplate = function(item) {
  var itemClasses = classNames('grocery-item',
                               'example-' + item.group.toLowerCase()),
      iconClasses = classNames('grocery-icon',
                               'rss-grocery',
                              'rss-grocery-' + item.attributeName);

  return(
    <div className={itemClasses}>
      <span className={iconClasses}></span>
      <p>{item.label} - {'$' + item.price.toFixed(2)}</p>
    </div>);
};
```


#### onChange
```js
var groceryCartHandler = function(item) {
  console.log('Add To Cart: ', item.label, ' ', 'Price: ', item.price);
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
  group: "Fruits",
  price: 0.79
},{
  id: 2,
  attributeName: "carrot",
  label: "Carrot",
  iconClass: "rss-grocery rss-grocery-carrot",
  group: "Vegetables",
  price: 0.21
}, ...
];
```
