!(function(undefined){

	// declare this somewhere:  DEBUGMODE = true;

	_log = (function (methods, undefined) {

		var Log = Error; // does this do anything?  proper inheritance...?
		Log.prototype.write = function (args, method) {
			/// <summary>
			/// Paulirish-like console.log wrapper.  Includes stack trace via @fredrik SO suggestion (see remarks for sources).
			/// </summary>
			/// <param name="args" type="Array">list of details to log, as provided by `arguments`</param>
			/// <param name="method" type="string">the console method to use:  debug, log, warn, info, error</param>
			/// <remarks>Includes line numbers by calling Error object -- see
			/// * http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
			/// * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
			/// * http://stackoverflow.com/a/3806596/1037948
			/// </remarks>

			// via @fredrik SO trace suggestion; wrapping in special construct so it stands out
			var suffix = {
				"@": (this.lineNumber
						? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
						: extractLineNumberFromStack(this.stack)
				)
			};
	
			args = args.concat([suffix]);
			// via @paulirish console wrapper
			if (console && console[method]) {
				if (console[method].apply) { console[method].apply(console, args); } else { console[method](args); } // nicer display in some browsers
			}
		};
		var extractLineNumberFromStack = function (stack) {
			/// <summary>
			/// Get the line/filename detail from a Webkit stack trace.  See http://stackoverflow.com/a/3806596/1037948
			/// </summary>
			/// <param name="stack" type="String">the stack string</param>
	
			if (!stack) return '?'; // IE?  whatever - http://stackoverflow.com/questions/1502765/javascript-stack-trace-in-ie-or-maybe-just-a-simple-javascript-error

			// correct line number according to how Log().write implemented
			var line = stack.split('\n')[3];
			// fix for various display text
			line = (line.indexOf(' (') >= 0
				? line.split(' (')[1].substring(0, line.length - 1)
				: line.split('at ')[1]
				);
			return line;
		};
	
		// method builder
		var logMethod = function(method) {
			return function (params) {
				/// <summary>
				/// Paulirish-like console.log wrapper
				/// </summary>
				/// <param name="params" type="[...]">list your logging parameters</param>
		
				// only if explicitly true somewhere
				if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) return;
		
				// call handler extension which provides stack trace
				Log().write(Array.prototype.slice.call(arguments, 0), method); // turn into proper array & declare method to use
			};//--	fn	logMethod
		};
		var result = logMethod('log'); // base for backwards compatibility, simplicity
		// add some extra juice
		for(var i in methods) result[methods[i]] = logMethod(methods[i]);
	
		return result; // expose
	})(['error', 'debug', 'info', 'warn']);//--- _log


	
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

	// helper macro to assist in inheritance
	Inherits = function (parentClass, constructorDefinition) {
		/// <summary>
		///		OOJS: declares that a new class inherits methods, etc from a parent class.  Will declare using the prototype `__initialize` method or provided constructorDefinition.
		///		Usage: var SUV = Inherits(Car, function() { /* the constructor */ });  Define(SUV, /* additional methods */);
		/// </summary>
		/// <param name="parentClass" type="Class">The parent class to inherit from.  Available in child class as <code>._parent</code></param>
		/// <param name="constructorDefinition" type="function">The regular constructor function.  Has access to <code>._parent</code>.</param>
		/// <remarks>via http://phrogz.net/js/classes/OOPinJS2.html and http://www.htmlgoodies.com/html5/tutorials/create-an-object-oriented-javascript-class-constructor.html </remarks>

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