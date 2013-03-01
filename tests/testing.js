; Assert = (function () {
	var argarr = function (args) {
		return Array.prototype.slice.call(args, 0);
	};

	var _log = function (method) {
		return function(argsAsListed) {
			if (console && console[method]) {
				var a = argarr(arguments); //Array.prototype.slice.call(arguments, 0);
				if (console[method].apply) console[method].apply(console, a);
				else console[method](a);
			}
		}
	};
	var log = _log('log');
	log.err = _log('error');
	log.info = _log('info');
	log.group = _log('group');
	log.end = _log('groupEnd');
	
	var goodOrBad = function (ok, args) {

	};

	var lib = {
		_testTwo: function (msgGood, msgBad, a, b, test) {
			//log.info('Test:', arguments.callee.caller.caller ? arguments.callee.caller.caller.name : '?', ' =====');
			if( !test(a,b) ) log.err(msgBad + ":", a, "::", b);
			else log(msgGood + ':', a, "::", b);
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
			lib._testTwo('is true', msg || 'not true', true, actual, function (x, y) { return x === y });
			// breaks "trace" -- lib.AreEqual(true, actual, msg || 'not true');
		}
		,
		IsFalse: function (actual, msg) {
			lib._testTwo('is false', msg || 'not false', false, actual, function (x, y) { return x === y });
			// breaks "trace" -- lib.AreEqual(false, actual, msg || 'not false');
		}
		,
		Tests: function (testList) {
			/// <summary>
			/// Execute a bunch of tests
			/// </summary>
			/// <param name="testList">list of tests (named functions) to run</param>

			if (!(testList instanceof Array)) testList = argarr(arguments);
			for (var i = 0, n = testList.length; i < n; i++) {
				log.group('Test: ' + testList[i].name);
				testList[i]();
				log.end();
			}
		}
	};

	return lib;
})();