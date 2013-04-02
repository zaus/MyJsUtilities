!(function ($, undefined, pieces, classes, i) {
	// v2 adapted from original @will http://stackoverflow.com/a/15623322/1037948
	// v3 adapted from @drzaus http://jsfiddle.net/drzaus/Hgjfh/5/
	// see http://jsfiddle.net/yaworsw/CALY5/2/

	get_selector = function (element) {
		pieces = [];

		for (; element && element.tagName !== undefined; element = element.parentNode) {
			if (element.className) {
				classes = element.className.split(' ');
				for (i in classes) {
					if (classes.hasOwnProperty(i) && classes[i]) {
						pieces.unshift(classes[i]);
						pieces.unshift('.');
					}
				}
			}
			if (element.id && !/\s/.test(element.id)) {
				pieces.unshift(element.id);
				pieces.unshift('#');
			}
			pieces.unshift(element.tagName);
			pieces.unshift(' > ');
		}

		return pieces.slice(1).join('');
	};

	$.fn.getSelector = function (only_one) {
		if (true === only_one) {
			return get_selector(this[0]);
		} else {
			return $.map(this, function (el) {
				return get_selector(el);
			});
		}
	};

})(jQuery);