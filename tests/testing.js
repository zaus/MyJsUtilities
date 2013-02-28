; Assert = (function () {
	var _log = function (method) {
		return function(argsAsListed) {
			if (console && console[method]) {
				var a = Array.prototype.slice.call(arguments, 0);
				if (console[method].apply) console[method].apply(console, a);
				else console[method](a);
			}
		}
	};
	var log = _log('log');
	log.err = _log('error');
	
	var goodOrBad = function (ok, args) {

	};

	var lib = {
		_testTwo: function(msgGood, msgBad, a, b, test) {
			if( !test(a,b) ) log.err(a, ' ' + msgBad + ' ', b);
			else log(a, ' ' + msgGood + ' ', b);
		}
		,
		AreEqual: function (expected, actual, msg) {
			lib._testTwo('equals', msg || 'does not equal', expected, actual, function (x, y) { return x === y });
		}
		,
		AreNotEqual: function (expected, actual, msg) {
			lib._testTwo('does not equal', msg || 'equals', expected, actual, function (x, y) { return x !== y });
		}
		,
		IsTrue: function (actual, msg) {
			lib.AreEqual(true, actual, msg || 'expected, but is not:');
		}
		,
		IsFalse: function (actual, msg) {
			lib.AreEqual(false, actual, msg || 'expected, but is not:');
		}

	};

	return lib;
})();