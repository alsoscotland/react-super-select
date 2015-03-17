# react-super-select

React Super Select aims to be a replacement for html select form elements.
This project is in nascent development stages.


## Demo & Examples

Live demo: [alsoscotland.github.io/react-super-select](http://alsoscotland.github.io/react-super-select/)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.


## Installation

The easiest way to use react-super-select is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You can also use the standalone build by including `dist/react-super-select.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-super-select --save
```


## Usage

__EXPLAIN USAGE HERE__

```
var ReactSuperSelect = require('react-super-select');

<ReactSuperSelect>Example</ReactSuperSelect>
```

### Properties

**externalSearchIconClass** (String)*optional*  - if you want to override the default magnifier icon in the search/filter input.  add a custom class here

**onChange** (Function) - the provided function in this prop will be triggered anytime a change event fires from the control

**placeholder** (String) - value serves as the html5 placeholder for the control's display input.  Useful if your site is localized

**searchPlaceholder** (String) - value serves as the html5 placeholder for the control's search field for filtering (requires that searchable is true). Useful if your site is localized

**searchable** (Boolean) - whether or not to allow search filtering on options, a search input with a magnifier icon will appear in the dropdown element when true

### Notes

TBD

### License

TBD

Copyright (c) 2015 Scotland Stephenson.

