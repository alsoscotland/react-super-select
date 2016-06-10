<!-- customOptionTemplateFunction -->
(**Function**) *optional*

This function provides custom templating capability for your dropdown options. It will be used to render the display of selected values in the case of a **multiple** select control which does not have **tags** set to true. 

The function should accept two parameters, 
- a single option object from your dataSource collection
- the current searchString (for **searchable** controls)

It should return your desired markup based on that single option object's properties and the search term
