<!-- pageDataFetch -->
(**Function**) *optional*

(A **hasMorePages** function should be provided when using this option)

Additional pages of data can be fetched via ajax if you provide a function as the value for this option. 

The function takes one argument, the value provided as the dataSource (or the return value of the ajaxDataSource function). 

It must return a promise object. (i.e. an object with a then function). The promise must resolve with a value meeting the description of the **dataSource** option documentation. 

The pageDataFetch function will be called based upon the user’s scroll position in the dropdown (reaching a threshold close enough to the end of the dropdown's results list). 

It will not be called when loading ajax data, or when filtering results in a searchable dropdown, or when **hasMorePages** evaluates to false
