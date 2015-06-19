<!-- ajaxDataFetch -->
(**Function**) *optional*

(**dataSource** must be supplied if left undefined)

Your select dropdown’s data may be fetched via ajax if you provide a function as the value for this option. 

The function will be passed one argument, the dataSource that was provided to
the **dataSource prop**

The return value of the function must be a promise object. (i.e. an object with a then function). The promise must resolve with a value meeting the description of the **dataSource** option documentation. 

The **dataSource** option should be left undefined when using this option.

