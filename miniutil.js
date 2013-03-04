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
		var ME = this;
		$.each($._t[t], function (c) {
			c.apply(ME, args);
		});
	};

	$.T = function (id) { var $o = $(id); this.t = $o ? $o.innerHTML : ''; }
	$.T.prototype.render = function (data,t) {
		t = t||this.t;
		$.each(data, function (v, k) {
			t = t.replace(new RegExp('{{' + k + '}}', 'g'), v);
		})
		return t;
	};

	$.log = function () { if (c && c.log) { var args = Array.prototype.slice.call(arguments, 0); c.log.apply ? c.log.apply(c, args) : c.log(args); } };
})(document, console);