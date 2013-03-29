!(function($) {
	// see discussion at https://coderwall.com/p/ziynxq;
	// inspired by https://coderwall.com/p/kdi8ua
	
	var N = function(key) { return 'getTextSize.' + key; },
		fontMapping = function($o, font) {
			//return {"font": font.font || $o.css('font')};
			var result = {}; // don't affect original object
			$.each(font, function(prop, val) {
				result[prop] = (val || $o.css(prop));
			});
			return result;
		}
	;
	
	$.fn.getTextSize = function(dimension, text, font) {
		/// <summary>
		///		Get width or height of element(s)
		///		<example><code>$('.el-one, .el-two, a').getTextSize(/*'height'*/ /*, false or new string*/ /*, font construct*/).join('px, ')+'px'</code></example>
		/// </summary>
		
		dimension = (dimension || 'width');
		// figure out what font aspects we're concerned with
		if( typeof font === "string" ) {
			font = {"font": font};
		}
		// include other common style properties that affect sizing
		font = $.extend({"font": false, "text-transform": false, "letter-spacing": false}, font);
		
		// allow multiple calculations
		return $.map($(this), function(o) {
			var $o = $(o), $fake = $o.data(N('fake'));
			if (!$fake) {
				// cloning causes duplication issues on subsequent calls
				// can attach to parent, but may be unnecessary parsing vs. body if updating font each time
				$fake = $('<span>').hide().addClass('placeholder').empty().appendTo(document.body);
				$o.data(N('fake'), $fake);
			}
			return $fake.html(text || $o.val() || $o.text()).css(fontMapping($o, font))[dimension]();
		});    
	};
})(jQuery);