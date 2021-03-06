MyJsUtilities
=============

Some useful javascript functions and stuff, cobbled together from various sources.

- [Testing/Demo Fiddle](http://jsfiddle.net/drzaus/cTy3Q/) _(also included in `/examples`)_
- [Another testing demo](http://codepen.io/zaus/pen/Bvaow) or [here](http://jsfiddle.net/drzaus/8bvar/10/)

Contents
--------

* **Logging**: Safe `console.log` wrapper with debugmode toggling.  Inspired by [Paul Irish](http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/).
* **Inheritance**: Object-oriented "macros" for class _definition_ (`Define`) and _inheritance_ (`Inherits`).  Inspired by [this](http://phrogz.net/js/classes/OOPinJS2.html) and [that](http://www.htmlgoodies.com/html5/tutorials/create-an-object-oriented-javascript-class-constructor.html)
* **Templating**: simple [Moustache-style](https://github.com/janl/mustache.js) template helper.
* **jQuery Plugins**:
    - **$each**: "fixes" `.each` so that `this` (and param) are jQuery, not DOM elements
    - **createNestedDom**: utility to construct multi-level DOM items for testing (particularly for [selector performance tests](http://jsperf.com/jquery-context-or-no-context/7))
    - **getSelector**: builds list of DOM elements in inheritance chain; includes tag, id, class
    - **getTextSize**: calculate width or height of the text within one or more elements -- specifically useful for calculating when to increase the dimensions of an input box during typing
	- **hasTriggers**: make it so one button can trigger behaviors on multiple targets -- specifically useful for having a 'show/hide all' button to activate a bunch of bootstrap toggles
    - **listEvents**: get all bound events (jQ 1.8+)
    - **triggerAny**: filter namespaced triggers, like `.custom1` to fire `click.custom1` and `change.custom1`

License
-------

As-you-wish.