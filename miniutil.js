;(function(c){
	$ = function (id) { return document.getElementById(id); }
	$.each = function (o, fn) { for (var p in o) { if (o.hasOwnProperty(p)) if (false === fn(o[p], p)) return; } }
	$.extend = function (a, b, c) { a = a || {}; $.each(b, function (v, k) { a[k] = v }); return c ? $.extend(a, c) : a; }

	T = function (id) { this.t = $(id).innerHTML; }
	T.prototype.render = function (data) {
		var t = this.t
		$.each(data, function (v, k) {
			t = t.replace(new RegExp('{{' + k + '}}', 'g'), v);
		})
		return t
	}

	_log = function () {
		if (c && c.log) {
			var a = Array.prototype.slice.call(arguments, 0);
			c.log.apply ? c.log.apply(c, a) : c.log(a);
		}
	}
})(console);