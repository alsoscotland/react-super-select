# react-super-select

React Super Select aims to be a replacement for html select form elements.
This project is in nascent development stages.


## Demo & Examples

Live demo and API docs: [alsoscotland.github.io/react-super-select](http://alsoscotland.github.io/react-super-select/)

To build and run the examples locally, run:

```
npm install
gulp rssdev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-super-select is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-super-select.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-super-select --save
```

## Dependencies
React-Super-Select requires 
  - [React](https://facebook.github.io/react/index.html)
  - [classNames](https://www.npmjs.com/package/classnames)
  - [Lodash](https://lodash.com/)

## Usage

To use react super-select (jsx), require the module in your source code, and add a ReactSuperSelect element with a combination of the properties listed below:

```
var ReactSuperSelect = require('react-super-select');
var exampleData = [
    { id: 1, name: 'option one'},
    { id: 2, name: 'option two'},
];
var exampleSelectHandler = function(selections) {
    console.log('user selected: ', selections);
};

<ReactSuperSelect dataSource={exampleData} onChange={exampleSelectHandler} />
```

### Properties

#### Boolean Options

**multiple** (Boolean) *optional*  - set true for a multi-select control with normal or custom templating.  When using the **tags** display option, this option is redundant

**searchable** (Boolean) *optional* - whether or not to show a search bar in the dropdown area which offers text-based filtering of the options-set (by label key)

**tags** (Boolean) *optional* - Whether or not to display your chosen multi-select values as tags.  (When set, there is no need to set the **multiple** option)

#### Custom CSS class options

**customClassName** (String) *optional* - this string value will be added as a css class to the control's main wrapping element.  You should be able to overide all styling with one point of css specificity by leading your rules with 
```css
.r-ss-wrap.{customClassName}
```


**customSearchIconClass** (String) *optional* - This class name will be added to the icon in the search-filtering bar (when **searchable** is true).  Allowing you to override the default search icon (default: a magnifying glass)

**customLoaderClass** (String) *optional* - Used in conjunction with the **ajaxDataSource** option.  A css class which will be added to the loading icon (default: an animated gif spinner as base64 background image in css) allowing css overrides.

**customTagClass** (String) *optional* - Used in conjunction with the **tags** option.  A css class which will be added to wrapper of a selection displayed as a tag. You should be able to overide all tag styling with one point of css specificity by leading your rules with 
```css
.r-ss-tag.{customTagClass} 
```

#### External Change Handler

**onChange** (Function) *required* - This is the main callback handler for the control.  When a user makes selections an array of selected (object) values will be passed to this handler function.

#### Data-Source Related props

**ajaxDataSource** (Function) (*optional - but **dataSource** must be supplied if undefined*) - Your select dropdown's data may be fetched via ajax if you provide a function as the value for this option.  The function takes no arguments, but it must return a **promise** object. (i.e. an object with a then function).  The promise must resolve with an array of objects (a collection) as described by the **dataSource** option documentation. Or a single option object.  The **dataSource** option should be left undefined when using this option.

**dataSource** (An Array of Objects, i.e. a collection) (*optional - but **ajaxDataSource** must be supplied if undefined*) - The dataSource option provides the data for your options dropdown. Each option in the collection must have:   
  - a unique value in the key set by the **optionValueKey** or the default of **id**
  - a value in the key set by the **optionLabelKey** or the default of **name**

**optionLabelKey** (String) (*optional - will use 'name' key if undefined*) - This value represents the key in each option object in your **dataSource** collection which represents the value you would like displayed for each option.

**optionValueKey** (String) (*optional - will use 'id' key if undefined*) - This value represents the key in each option object in your **dataSource** collection which represents the value that uniquely identifies that option across the dataSource collection.  Think of it in terms of the value attribute of a traditional html <select> element

#### Rendering (Iterator) Function properties

 **customFilterFunction** (Function) *optional* - Used in conjunction with the **searchable** options.  The function provided for this option will serve as a replacement of the default search filter function. (A default lowercase string comparison for text.  Matches the **optionLabelKey** value to the text entered into the dropdown's search field).  The function is passed as the second arg to [Lodash's filter function](https://lodash.com/docs#filter) and is along with your **dataSource** as the first arg.

 **customOptionTemplateFunction** (Function) *optional* - This function provides custom templating capability for your dropdown options and the display of selected values.  The function should accept a single option object from your **dataSource** collection and return your desired markup based on that object's properties.

#### Localization String Options
  
  **noResultsString** (String) *optional* - A string value which will be displayed when your dropdown shows no results.  (i.e. dataSource is an empty collection, or ajaxDataSource returns an empty collection)

  **placeholder** (String) *optional* - This string value will be displayed in the main display area of your control before a user has selected any values

  **searchPlaceholder** (String) *optional* - (Used in conjunction with the **searchable** option) This string will be shown in the dropdown area's searchfield when a user has not entered any characters. 





### License

MIT License

Copyright (c) 2015 Scotland Stephenson.

