!(function($, undefined) {
	// adapted from http://stackoverflow.com/a/15623322/1037948
	// see http://jsfiddle.net/drzaus/Hgjfh/5/
	
	get_selector = function(element, delim) {
		if( typeof element === typeof undefined || typeof element.tagName === typeof undefined ) return '';
		delim = delim || ' > ';
		pieces = [];
		do {
			if (element.className) {
			var classes = element.className.split(' ')
			for (var i in classes) {
				if(classes.hasOwnProperty(i)) {
					pieces.unshift(classes[i]);
					pieces.unshift('.');
				}// hasOwnProperty
			}// foreach classes
			}// if className
			if (element.id) {
			pieces.unshift(element.id);
			pieces.unshift('#');
			}// if id
			// for some reason I'm still seeing "undefined" here in Chrome...strip empty items later
			pieces.unshift(element.tagName);
			pieces.unshift(delim);
		} while(element = element.parentNode);
		
		return pieces.slice(3).join('');
	};

	$.fn.getSelector = function(only_one, delim) {
		delim = (delim || (typeof only_one === typeof true ? false : only_one) || ' > ');
		
		if (true === only_one) {
			return get_selector(this[0], delim);
		} else {
			return $.map( this, function(el) {
				return get_selector(el, delim);
			});
		}
	};

})(window.jQuery);