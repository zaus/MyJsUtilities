;(function(d, c, _NC, u){
	// mini jQuery
	if(typeof u !== typeof $) _NC = $; // no conflict
	$ = function (id) { return d.getElementById(id); }
	if(_NC) $.NC = _NC;
	$.each = function (o, fn) { for (var p in o) { if (o.hasOwnProperty(p)) if (false === fn.call(o, o[p], p)) return; } }
	$.extend = function (a, b, c) { a = a || {}; $.each(b, function (v, k) { a[k] = v }); return c ? $.extend(a, c) : a; }

	// pubsub
	$._t = {};
	$.on = function (t, cb, p) {
		$.each(t.split(' '), function (t) {
			if (!$._t[t]) $._t[t] = [];
			return [t, $._t[t].push(cb) - 1]; /* returns "handle", index to topic.callback */
		});
	};
	$.off = function (t, c) { c = t[1]; t = $._t[t[0]]; if (t && t[c]) { delete (t[c]); t.splice(c, 1); /* not happening enough to optimize remove? */ } };
	$.go = function (t, args) {
		// "bubble" up namespaces
		p = t.split('.');
		$.each(p, function (o, i) {
			p[i] = typeof p[i - 1] === typeof u ? p[i] : p[i-1] + '.' + p[i];
		});
		var ME = this;
		$.each(p, function (t) {
			$.each($._t[t], function (c) {
				c.apply(ME, args); // TODO: add topic?
			});
		});
	};
	
	$.T = function (id) {
		/// <summary>
		/// Templater:  uses moustache-style token delimiters {{ }}
		/// </summary>
		/// <param name="id">the template element; leave blank to use manual template</param>
		var $o = $(id); this.t = $o ? $o.innerHTML : '';
	}
	$.T.prototype.render = function (data,t) {
		/// <summary>
		/// Inject data, replacing tokens; optionally using provided template string
		/// </summary>
		/// <param name="data">the object of placeholder/replacement pairs</param>
		/// <param name="t">optional template string</param>
		/// <returns type="string">rendered string</returns>

		t = t||this.t;
		$.each(data, function (v, k) {
			t = t.replace(new RegExp('{{' + k + '}}', 'g'), v);
		})
		return t;
	};

	$.log = function (args) {
		/// <summary>
		/// console.log wrapper
		/// </summary>
		/// <param name="args" type="params">param argument listing</param>

		if (c && c.log) { args = Array.prototype.slice.call(arguments, 0); c.log.apply ? c.log.apply(c, args) : c.log(args); }
	};
	
	$.string = function(len) {
		/// <summary>
		/// Generate a short random alphanumeric string.  See http://stackoverflow.com/a/8084248/1037948
		/// </summary>
		/// <param name="len">how many chars to return</param>
		/// <returns type="string">random alphanumeric string</returns>
		
		var s = Math.random().toString(36).substr(2, len)
		if (len > 16) s += $.string(len - 16);
		return s;
	};
})(document, console);