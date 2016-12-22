# cg-template-component

> JavaScript Accessible *your_name* Component by [Competentum Group](http://competentum.com/).
  Exported as a [UMD](https://github.com/umdjs/umd) module.

[![NPM][npm-image]][npm-url]

## Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
    - [Static properties](#static-properties)
    - [Constructor](#constructor)
    - [Instance properties](#instance-properties)
    - [Instance methods](#instance-methods)


## Installation
Component can be installed with npm:
```
npm install --save cg-input
```

## Usage
to be described

## API

### Static properties
to be described

<a name="constructor"></a>
### new CgTemplateComponent(settings) - constructor
to be described

### Instance properties
to be described

#### DOM Elements
to be described

### Instance methods
to be described

<a name="method_on"></a>
#### `.on(eventName, listener)`
- `eventName` *{string}* The name of the event.
- `listener` *{Function}* The callback function.

Adds the `listener` function to the end of the listeners array for the event named `eventName`. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.

```javascript
slider.on(CgTemplateComponent.EVENTS.CHANGE, function (value) {
    console.log('changed to:', value);
});
```

> Current class extends Node.js EventEmitter. More information about working with events you can get [here](https://nodejs.org/api/events.html).



[npm-url]: https://www.npmjs.com/package/cg-template-component
[npm-image]: https://img.shields.io/npm/v/cg-template-component.svg?style=flat-square