!(function($) {
	/*
	
	Adds listeners on `selectors` for the given element(s) (e.g. `this.on(trigger, selectors, fn)`)
	so that when triggered, will apply a behavior to each of _their_ targets
	
	example:
		<div class="trigger-container">
			<button data-action="trigger">Show/Hide All</button>
			
			<!-- some bootstrap collapse/accordions buttons -->
			
			<a data-toggle="collapse" data-target="#sec-1">Section 1</a>
			<article id="sec-1"> ... some content ... </article>
			
			<a data-toggle="collapse" data-target="#sec-2">Section 2</a>
			<article id="sec-2"> ... some content ... </article>
			
			<a data-toggle="collapse" data-target="#sec-3">Section 3</a>
			<article id="sec-3"> ... some content ... </article>
		</div>
		
		<script>
			$('.trigger-container').hasTriggers();
			
			// or, because calling click on many many elements could be slow, cheat and perform 'toggle' directly
			$('.trigger-container').hasTriggers({
				behavior: 'toggleClass',
				args: 'in',
				children: 'article'
			});
		</script>
	
	*/

	$.fn.hasTriggers = function (config) {
		/// <summary>
		/// For the given trigger/toggle-container, add listener to children's trigger that when fired will "propagate" to perform a behavior on other targets, with optional args.  Most options may be specifically overridden with data- attributes of the same name.
		/// </summary>
		/// <param name="config">option configuration: trigger selectors, trigger action, triggered behavior, optional args for that behavior, the target selector or parent/children selectors, appearance flag and/or how to switch the appearance once 'activated'</param>

		// needs to be inside a toggle-container element
		var ME = this, breaker = {}, options = $.extend({}, $.fn.hasTriggers.defaults, config);

		// the behavior
		return ME.on(options.trigger, options.selectors, function() {
			var $btn = $(this)
				// better to use single object?, meta = $btn.data('togglemeta')
				, behavior = $btn.data('behavior') || options.behavior // the behavior to toggle
				, args = $btn.data('args') || breaker // optional behavior arguments
				, $target = $btn.data('$target') // cached target, not the selector 'target'
				;

			if (!$target) {
				// if the target not provided explicitly, will look for nearest 'parent' up the tree and then find its 'children'
				var target = $btn.data('target') || options.target;
				var sel = !target ? [false, false] : target.split('$'); // look for magic "self" selector; anything before is an ancestor, anything after is descendant *of that ancestor*
				if (sel.length < 2) $target = $(target);
				else {
					$target = $btn.closest(sel[0] || $btn.data('parent') || options.parent || ME).find(sel[1] || $btn.data('children') || options.children);
				}

				$btn.data('$target', $target); // cache
			}

			if (args !== breaker) $target[behavior].apply($target, args.split(','));
			else $target[behavior]();
			
			// and apply the appearance switch
			options.appearanceSwitch($btn, $btn.data('activeClass') || options.activeClass);

			// always stop other element events unless explicitly allowed
			if (!$btn.data('propagate')) return false;
		});
	};
	
	$.fn.hasTriggers.defaults = {
		selectors: '[data-action="trigger"]',
		trigger: 'click', // what activates the `selectors`
		behavior: 'click', // what to trigger on `targets`
		args: null, // comma-separated arguments to send to `behavior`
		target: null, // explicit targets to be triggered, or use `parent` and/or `children`
		parent: null, // '.trigger-container', <-- use instead the context container if not given
		children: '[data-toggle]', // bootstrap collapse buttons are usual target
		activeClass: 'in', // just so it matches bootstrap collapse appearance for shared behavior
		appearanceSwitch: function ($btn, activeClass) {
			/// <summary>
			/// How to flip the appearance of the trigger button (not targets); by default toggles the `config.activeClass`
			/// </summary>
			/// <param name="$btn">the button that triggered the behavior</param>
			/// <param name="activeClass">use config setting if not provided</param>
			/// <returns type=""></returns>
			
			return $btn.toggleClass(activeClass);
		}
	};
})(jQuery);