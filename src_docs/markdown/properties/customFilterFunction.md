<!-- customFilterFunction -->
(**Function**) *optional*

(Used in conjunction with the **searchable** option)

The function provided will serve as a replacement of the default search filter function. 

(If left undefined the default filter function will be used) 

The Default Filtering function is a lowercase string comparison for text. It matches the **optionLabelKey** value to the text entered into the dropdown’s search field). The function is leveraged by Lodash’s filter function with your dataSource collection as its first argument
