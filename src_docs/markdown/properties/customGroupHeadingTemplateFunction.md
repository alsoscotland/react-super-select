<!-- customGroupHeadingTemplateFunction -->
(**Function**) *optional* 

(Used in conjunction with the **groupBy** option)

This function provides custom templating capability for your dropdown heading options. 

The function will be called with value returned as each group’s object key as its first argument. (This is the value returned by Lodash’s groupBy when passed the value of your groupBy option). It should return your desired group heading markup
