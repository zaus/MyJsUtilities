!(function(undefined){
	DEBUGMODE = true;

	_log = function (params) {
		/// <summary>
		/// Paulirish-like console.log wrapper
		/// </summary>
		/// <param name="params" type="[...]">list your logging parameters</param>
		if (typeof undefined === typeof DEBUGMODE || !DEBUGMODE) return;

		if (console && console.log) {
			if (console.log.apply)
				console.log.apply(console, Array.prototype.slice.call(arguments, 0));
			else
				console.log(Array.prototype.slice.call(arguments, 0));
		}
	};//--	fn	_log

	// helper macro to assist in class definition
	Define = function (ME, methods) {
		/// <summary>
		///		OOJS: Define prototype methods for given class.  Note, to take full advantage of Inherits declare an `__initialize` function.
		///		Usage: var someClass = Define(function(){ ... }, { methodA: function(){...}, methodB: ... });
		///		Usage: var anotherClass = function() { ... };  Define(anotherClass, { methods... });
		/// </summary>
		/// <param name="ME" type="function">The class to define methods for</param>
		/// <param name="methods" type="JSON">mapping of method names and functions</param>

		for (var method in methods) {
			// only explicitly defined methods
			if (methods.hasOwnProperty(method)) {
				ME.prototype[method] = methods[method];
			}
		}

		return ME;
	};//--	fn	Define

	// helper macro to assist in inheritance; via http://phrogz.net/js/classes/OOPinJS2.html + someothersource
	Inherits = function (parentClass, constructorDefinition) {
		/// <summary>
		///		OOJS: declares that a new class inherits methods, etc from a parent class.  Will declare using the prototype `__initialize` method or provided constructorDefinition.
		///		Usage: var SUV = Inherits(Car, function() { /* the constructor */ });  Define(SUV, /* additional methods */);
		/// </summary>
		/// <param name="parentClass" type="Class">The parent class to inherit from.  Available in child class as <code>._parent</code></param>
		/// <param name="constructorDefinition" type="function">The regular constructor function.  Has access to <code>._parent</code>.</param>

		var childClass = function () {
			this.__initialize.apply(this, arguments);
		};
		
		childClass.prototype = new parentClass; // where the inheritance occurs
		childClass.prototype.constructor = childClass; // Otherwise instances of child would have a constructor of parent
		childClass.prototype._parent = parentClass.prototype; // expose super
		
		// attach optional "constructor" override
		childClass.prototype.__initialize = (constructorDefinition || childClass.prototype.__initialize || function() { });
		return childClass;
	};//--	fn	Inherits


	Templater = Define(
		function (idOrTemplate, openToken, closeToken) {
			// assume HTML provided
			if (idOrTemplate[0] == '<') {
				this.template = idOrTemplate;
			}
			else {
				this.template = document.getElementById(idOrTemplate).innerHTML;
			}
			if( openToken ) this.openToken = openToken;
			if( closeToken ) this.closeToken = closeToken;
		}//--	Templater
		, {
			get_token_regex: function (token) {
				return new RegExp(this.openToken + token + this.closeToken, 'g');
			}//--	Templater.render
			,
			openToken: '{{'
			,
			closeToken: '}}'
			,
			render: function (tokens) {
				var ME = this;
				ME.last_render = ME.template;
				for (var placeholder in tokens) {
					if (tokens.hasOwnProperty(placeholder)) {
						ME.last_render = ME.last_render.replace(ME.get_token_regex(placeholder), tokens[placeholder]);
					}
				}
				return ME.last_render;
			}//--	Templater.render
		});//	define Templater

})();