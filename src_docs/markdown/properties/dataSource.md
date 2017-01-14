<!-- dataSource -->
(**Array**|**Object**|**Collection Object**) *optional* 

(**ajaxDataFetch**must be supplied if left undefined)

The dataSource option provides the data for your options dropdown. The value provided will be passed to an internal parser (_configureDataSource), which will return a collection (array of option objects) found based on argument type

The parsing method supports dataSource values as:
  - an array of option objects (will be directly assigned to state.data)
  - an object with a collection property (object.collection will be assigned to state.data)
  - an object with a get function (the return value of object.get(‘collection’) will be assigned to state.data)

Each option in the resulting collection must have the following properties:
  - a unique value corresponding to the key set by the **optionValueKey** or the default optionValueKey of 'id'
  - a defined value corresponding to the key set by the **optionLabelKey** or the default optionLabelKey of 'name'

Each Option may be disabled for selection by adding an optional boolean property "disabled" i.e. disabled: true

