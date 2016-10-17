### JSX Markup
```html
<ReactSuperSelect placeholder="Pick an Item" 
                  searchPlaceholder="Search shop"
                  multiple={true}
                  onChange={this.handlerExample}
                  customOptionTemplateFunction={selectedItemsTemplate} 
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
var selectedItemsTemplate = function(controlSelectedValue) {
  if (console && console.info) {
    console.info('selected value: (%s)', controlSelectedValue);
  }

  return(
    <div>
      {controlSelectedValue.length} item(s) selected
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
