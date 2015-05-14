# react-super-select

A flexible replacement for the html select control built with React and Lodash

####Features:
  - template capability for options
  - aria-compliant keyboard navigation
  - multiselect & tags
  - ajax support
  - ajax paging/load-more support
  - grouped options under headings
  - easy style customization
  - localization support


## Demo & Examples

Live demo and API docs: [alsoscotland.github.io/react-super-select](http://alsoscotland.github.io/react-super-select/)

To build and run the examples locally, run:

```
npm install
gulp rssdev
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.

## development and contributions

Feedback, issue reports, and feature requests are welcome.  There is a provided gulp task for running a dev environment with live linting
```
gulp rssdev
```

Please ensure any pull requests have jest specs and that all tests succeed when running
```
npm test
```

## A note on accessibility
Aria support for accessibility is a clear objective for this control. Finding clear and accurate information regarding cross-device accessibility practices is proving difficult to come by.  If you are a daily screen-reader user, or if you have particular expertise regarding accessibility, I would love to get your input on how to make the control better.

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

To use react super-select (jsx), require the module in your source code, and add a ReactSuperSelect element with a combination of the properties listed in the [API docs](http://alsoscotland.github.io/react-super-select/) or the [Annotated Source](http://alsoscotland.github.io/react-super-select/example/annotated-source.html)

### License

MIT License

Copyright (c) 2015 Scotland Stephenson.

