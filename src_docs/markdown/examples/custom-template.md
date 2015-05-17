### JSX Markup
```html
<ReactSuperSelect placeholder="Pick an Item" 
                  searchPlaceholder="Search shop"
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
