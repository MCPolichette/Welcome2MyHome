var exec = require("child_process").exec;

exports.isObject = function isObject(x, nullIsObject, arrayIsObject) {
	return typeof(x) === "object" && (nullIsObject || x !== null) && (arrayIsObject || !exports.isArray(x));
};

exports.isAnonObject = function isAnonObject(x, nullIsObject) {
	return exports.isObject(x, nullIsObject) && x.constructor.name === "Object";
};

exports.isFunction = function isFunction(x) {
	return typeof(x) === "function";
};

exports.isString = function isString(x) {
	return typeof(x) === "string";
};

exports.isArray = function isArray(x) {
	return Object.prototype.toString.call(x) === '[object Array]';
};

exports.isNumber = function isNumber(x, nanIsNumber, infinityIsNumber) {
	return typeof(x) === "number" && (nanIsNumber || !isNaN(x)) && (infinityIsNumber || isFinite(x));
};

exports.isBoolean = function isBoolean(x) {
	return typeof(x) === "boolean";
};

exports.shallowCopy = function shallowCopy(source, destination, fnFilter) {
	if (exports.isFunction(destination)) {
		fnFilter = destination;
		destination = {};
	}
	fnFilter = fnFilter || function () { return true; };
	destination = destination || {};
	if (!exports.isObject(source)) {
		return destination;
	}
	Object.keys(source).forEach(function (key) {
		var value = source[key];
		if (fnFilter(key, value, destination[key])) {
			destination[key] = value;
		}
	});
	return destination;
};

function merge(source, destination) {
	destination = destination || {};
	if (!exports.isObject(source)) {
		return destination;
	}
	Object.keys(source).forEach(function (key) {
		var value = source[key];
		if (exports.isAnonObject(value)) {
			if (exports.isAnonObject(destination[key])) {
				merge(value, destination[key]);
			} else {
				destination[key] = merge(value);
			}
		}
		else if (value !== undefined) {
			destination[key] = value;
		}
	});
	return destination;
}
exports.merge = merge;

exports.syncWrapper = function syncWrapper(syncFn) {
	return function wrappedSyncFn() {
		var callback = arguments[arguments.length - 1];
		try {
			var result = syncFn.apply(null, Array.prototype.slice.call(arguments, 0, -1));
			callback(null, result);
		}
		catch (err) {
			callback(err);
		}
	}
};

exports.execOrDie = function execOrDie(command, callback) {
	exec(command, function (err, _, stderr) {
		if (stderr) {
			err = new Error(stderr);
		}
		if (err) {
			console.error(err);
			process.exit(1);
		}
		callback();
	});
};