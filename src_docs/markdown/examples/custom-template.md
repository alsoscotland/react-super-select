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
var _getHighlightedSearchLabel = function(item, search, searchRegex) {
  var labelMarkup = item.label.replace(searchRegex, '<span style="background-color: #f90;">' + search + '</span>');

  return React.DOM.span({ dangerouslySetInnerHTML: { __html: labelMarkup } });
}

var groceryCartItemTemplate = function(item, search) {
  if (console && console.info) {
    console.info('search term (%s) is provided for highlighting/modifying template output', search);
  }

  var itemClasses = classNames('grocery-item',
                               'example-' + item.group.toLowerCase()),
      iconClasses = classNames('grocery-icon',
                               'rss-grocery',
                              'rss-grocery-' + item.attributeName),
      labelMarkup = search ? _getHighlightedSearchLabel(item, search, new RegExp( search, 'i')) : item.label;

  return(
    <div className={itemClasses}>
      <span className={iconClasses}></span>
      <p>{labelMarkup} - {'$' + item.price.toFixed(2)}</p>
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
