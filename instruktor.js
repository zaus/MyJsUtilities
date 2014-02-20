(function ($) {
	var getDisplayType = function(el) {
		switch (el.tagName.toUpperCase()) {
			case 'SCRIPT':
				return 'js';
			case 'STYLE':
			case 'LINK':
				return 'css';
			default:
				return 'html';
			}
		},
		repeatUntil = function(isOkayFn, delay, counter) {
			if (!!counter) clearTimeout(counter);

			if (!isOkayFn()) {
				var c = setTimeout(function() {
					repeatUntil(isOkayFn, delay, c);
				}, delay || 1000);
			}
		};

	$.fn.Instruktor = function () {
		var $return = this.each(function(i, v) {
			var $me = $(v), target = $me.data('target') || '.example', $targets = $me.nextUntil(':not(' + target + ')'), result = '';

			$targets.each(function(j, t) {
				result += '<pre class="brush: ' + getDisplayType(t) + '">' + $('<div/>').text(t.outerHTML).html() + '</pre>';
			});

			$me.append('<div class="code-sample">' + result + '</div>');
		});
		return $return;
	};
})(jQuery);