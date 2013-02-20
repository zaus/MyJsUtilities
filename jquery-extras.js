(function($){

	/** turn event type + namespace into string */
	var eTaN = function(e) {
		return e.type + ( e.namespace ? '.' + e.namespace : '' );
	};
  
	/** shortcut to getting the list of bound events for an element, since it may change */
	$.fn.listEvents = function(isSorted) {
		var result = [], /*jQuery event listing*/evts, /*list event names*/evns;
		this.each(function() {
			// from http://jebaird.com/blog/trigger-all-events-element-using-jquery
			// only works for < jQuery 1.4?
			// ### return $el.data('events') || [];
			
			// investigate DOM properties prefixed with "on"? http://stackoverflow.com/a/5848702/1037948 -- no, doesn't work
			
			// jQuery 1.8+ http://stackoverflow.com/a/571087/1037948
			// but dangerous?: http://stackoverflow.com/a/13018025/1037948
			evts = $._data(this, "events"); // the iffy bit, in case jQuery changes again
			
			if( ! evts ) return;
			// extract type+namespace, turn into list of "readable" names
			// remove duplicates with $.unique
			evns = $.unique( 
				// turn list of "event: specifics" into flat array
				$.map(evts, function(f,n) {
					return $.map(f, function(e) { return eTaN(e); });
				}) //-- .map evts
			); //-- .unique
			// optionally sort so it looks better
			result.push.apply(result, (isSorted ? evns.sort() : evns) ); // $.merge?
		});//-- this.each
		
		console.log('>> listing events', result);
		return result;
	};//--	$.fn.listEvents

	/** filterable trigger */
	$.fn.triggerAny = function(filter, data){
		// note the use of .$each vs. .each
		return this.$each(function(i,$o){
			var events = $.grep( $o.listEvents(), function(en) {
					// TODO: regex to "translate" wildcards
					return -1 != (en).indexOf(filter);
				})
			;
			$.each(events, function(i,en){ $o.trigger( en, data ); });
		});
	};//--	$.fn.triggerAny
	
	/** like jQuery.each, but `this` in scope is the jQuery element instead */
	$.fn.$each = function (callback) {
		/// <summary>
		/// Autobind each element as jQuery object to $this
		/// </summary>
		/// <param name="callback">loop through jQuery elements; note that `this` in scope is the jQuery object, not the DOM element</param>

		return this.each(function (i, o) {
			var $o = $(o);
			return callback.call($o, i, $o);
		});
	};

})(jQuery);