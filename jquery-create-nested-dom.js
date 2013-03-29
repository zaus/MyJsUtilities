!(function($){
var	ab_counter = 0 // ab counter
	, ab = function() { return ( ab_counter++ % 7 == 1 ? 'a' : 'b' ); }
	// loop and dom creation
	, createLoop = function(counter, createFn) {
		counter++; // offset pre-decrement
		while(--counter > 0) {
				createFn(counter);
		};
	}
	, levelDom = '<div id="level{{level}}-{{id}}" class="level{{level}} {{ab}}"><h{{level}}>Level {{level}} ({{id}})</h{{level}}></div>'
	, createLevel = function(level, id) {
			return $(levelDom.replace('{{ab}}', ab()).replace(/{{level}}/ig, level).replace(/{{id}}/ig, id));
	}
	;

	$.createNestedDom = function(container_selector, itemsInLevel1, itemsInLevel2, itemsInLevel3, itemsInLevel4, hasStyle) {
		///	<summary>
		///		Attach up to 4 levels of preconfigured nested elements to given container.
		///		<example>$.createNestedDom('#container', /*level1=*/ 5, /*level2=*/ 3, /*level3=*/ 4, /*level4=*/ 1 /*, false*/);</example>
		///	</summary>
		
		var $container = $(container_selector);
		
		if( false !== hasStyle ) {
			var style = '<style>' +
				'	{{container}} { font-size:12px; }' +
				'	{{container}} h1, {{container}} h2, {{container}} h3, {{container}} h4 { margin:0.25em; padding:0; }' +
				'	{{container}} .level1, {{container}} .level2, {{container}} .level3, {{container}} .level4 { border: 3px solid black; display:inline-block; margin:0.25em; padding:0.5em; }' +
				'	{{container}} .level1 { border-color: red; }' +
				'	{{container}} .level2 { border-color: blue; }' +
				'	{{container}} .level3 { border-color: green; }' +
				'	{{container}} .a { background-color: #ccc; }' +
				'	{{container}} .b { background-color: white; }' +
			'</style>';
		
			// add style to container
			$container.append(style.replace(/{{container}}/g, container_selector));
		}
	
		// loop to create each level
		createLoop(itemsInLevel1, function(i1) {
			var $l1 = createLevel(1, i1);

			createLoop(itemsInLevel2, function(i2) {
					var $l2 = createLevel(2, [i1, i2].join('-'));
					
					createLoop(itemsInLevel3, function(i3) {
							var $l3 = createLevel(3, [i1, i2, i3].join('-'));
							
							createLoop(itemsInLevel4, function(i4) {
									var $l4 = createLevel(4, [i1, i2, i3, i4].join('-'));
							
									$l3.append($l4);
							});// loop level4
							
							$l2.append($l3);
					});// loop level3

					$l1.append($l2);
			});// loop level2

			$container.append($l1);
		});// loop level1

	}; //---	fn	$.createNestedDom

})(jQuery);