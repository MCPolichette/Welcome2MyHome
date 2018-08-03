var libPath = require("path");

var libTools = require("./tools"),
	libVars = require("./vars");

function doReadDir(path, options, callback, shared) {
	shared = shared || {
		basePath: path,
		cancelSignal: false,
		details: options.return === libVars.RETURN_TYPES.details
	};

	var waitCount = 0,
		results = [],
		calledBack = false;

	options.readdir.fn(path, function (err, files) {
		if (shared.cancelSignal) {
			return onWaitDone();
		}

		if (err) {
			return callback && callback(err);
		}

		// Allow for a special case when we can just push results, without inspection
		var needStat = options.stat.enabled
			|| options.recursive
			|| (options.filter !== true
				&& (options.filter.file !== true
					|| options.filter.directory !== true
					|| options.filter.symbolicLink !== true
					|| options.filter.blockDevice !== true
					|| options.filter.characterDevice !== true
					|| options.filter.FIFO !== true
					|| options.filter.socket !== true));

		files.forEach(function (file) {
			var fullPath = libPath.resolve(path,  file),
				relativePath = libPath.relative(shared.basePath, fullPath),
				extension = libPath.extname(file),
				res;
			if (shared.details) {
				res = {
					name: file,
					path: fullPath,
					relativePath: relativePath,
					basename: libPath.basename(file, extension),
					extension: extension
				};
			} else {
				switch (options.return) {
					case libVars.RETURN_TYPES.names: res = file; break;
					case libVars.RETURN_TYPES.relativePaths: res = relativePath; break;
					default: res = fullPath; break;
				}
			}

			if (needStat) {
				doStat(fullPath, res);
			} else {
				results.push(res);
			}
		});

		if (waitCount === 0) {
			onWaitDone(null);
		}
	});

	return options.sync ? results : undefined;

	function onWaitDone(err) {
		waitCount--;
		if (!err && waitCount > 0) {
			return;
		}

		if (calledBack) {
			return;
		}
		calledBack = true;
		if (err) {
			shared.cancelSignal = true;
			return callback && callback(err);
		}
		if (shared.cancelSignal) {
			return callback && callback(null);
		}
		return callback && callback(null, results);
	}

	function doHandleError(err, name, res) {
		switch (options[name].errorStrategy) {
			case libVars.ERROR_STRATEGIES.fatal:
				onWaitDone(err);
				return true;
			case libVars.ERROR_STRATEGIES.property:
				if (shared.details) {
					res[name + "Error"] = err;
					res[name] = options[name].errorValue;
				}
				break;
			case libVars.ERROR_STRATEGIES.replace:
				if (shared.details) {
					res[name] = err;
				}
				break;
			case libVars.ERROR_STRATEGIES.swallow:
				break;
			default:
				onWaitDone(new Error("Unknown error strategy: " + options[name].errorStrategy));
				return true;
		}
		onWaitDone();
		return false;
	}

	function doFilter(res, filter) {
		if (!filter) {
			return false;
		}
		if (filter === true) {
			return true;
		}
		if (filter.test) {
			return filter.test(res.path || res);
		}
		return filter(res);
	}

	function doStat(fullPath, res) {
		waitCount++;

		options.stat.fn(fullPath, function (err, stat) {
			if (err) {
				return doHandleError(err, "stat", res);
			}

			if (shared.cancelSignal) {
				return onWaitDone();
			}

			var isDirectory = stat.isDirectory(),
				fileType = isDirectory ? libVars.FILE_TYPES.directory
					: stat.isFile() ? libVars.FILE_TYPES.file
					: stat.isSymbolicLink() ? libVars.FILE_TYPES.symbolicLink
					: stat.isBlockDevice() ? libVars.FILE_TYPES.blockDevice
					: stat.isCharacterDevice() ? libVars.FILE_TYPES.characterDevice
					: stat.isFIFO() ? libVars.FILE_TYPES.FIFO
					: stat.isSocket() ? libVars.FILE_TYPES.socket
					: null;
			if (shared.details) {
				if (options.stat.enabled) {
					res.stat = stat;
				}
				res.type = fileType;
			}
			var detailedFilters = libTools.isAnonObject(options.filter);
			if ((!detailedFilters && doFilter(res, options.filter))
				|| (detailedFilters && doFilter(res, options.filter.any) && doFilter(res, options.filter[fileType]))) {
				results.push(res);
			}

			if (options.recursive && isDirectory && (!options.excludeDirs || options.excludeDirs.indexOf(res.relativePath) === -1)) {
				doRecurse(fullPath, res);
			}
			
			if (options.content.enabled && shared.details && fileType === libVars.FILE_TYPES.file) {
				doReadContent(res, stat);
			}

			return onWaitDone();
		});
	}

	function doReadContent(res, stat) {
		if (options.content.maxSize && options.content.maxSize < stat.size) {
			return;
		}

		var encoding = false;
		if (options.content.asText === true || doTest(options.content.asText)) {
			encoding = "utf-8";
		}
		else if (options.content.asBinary === true || doTest(options.content.asBinary)) {
			encoding = null;
		}
		if (encoding === false) {
			// File did not match any filter
			return;
		}

		waitCount++;
		return options.content.fn(res.path, encoding, function (err, content) {
			if (err) {
				return doHandleError(err, "content", res);
			}

			res.content = content;
			return onWaitDone();
		});

		function doTest(filters) {
			if (!filters) {
				return false;
			}
			for (var i = 0; i < filters.length; i++) {
				var filter = filters[i];
				if (libTools.isFunction(filter) && filter(res, stat)) {
					return true;
				}
				if (filter.test && filter.test(res.path)) {
					return true;
				}
			}
			return false;
		}
	}

	function doRecurse(fullPath, res) {
		waitCount++;

		return doReadDir(fullPath, options, doRecurseCallback, shared);

		function doRecurseCallback(err, innerResults) {
			if (err) {
				return doHandleError(err, "readdir", res);
			}

			if (shared.cancelSignal) {
				return onWaitDone();
			}

			if (options.tree) {
				if (!shared.details) {
					var resHash = {};
					switch (options.return) {
						case libVars.RETURN_TYPES.fullPaths: resHash.path = res; break;
						case libVars.RETURN_TYPES.names: resHash.name = res; break;
						case libVars.RETURN_TYPES.relativePaths: resHash.relativePath = res; break;
					}
					res = resHash;
				}
				res.content = innerResults;
				results.push(res);
			} else {
				innerResults.forEach(function (innerResult) {
					results.push(innerResult);
				});
			}
			return onWaitDone();
		}
	}
}

/**
 * Read files recursively
 * @param {string} path Path to read
 * @param {ReaddirPlusOptions|object} [userOptions]
 * @param {function(Error, ReaddirPlusFile[])} callback
 */
function readdirPlus(path, userOptions, callback) {
	if (libTools.isFunction(userOptions)) {
		callback = userOptions;
		userOptions = null;
	}

	var options = libTools.merge(libVars.DEFAULT_OPTIONS);

	if (userOptions) {
		userOptions.stat = normalizeSection(userOptions.stat);
		userOptions.content = normalizeSection(userOptions.content);

		if (userOptions.content) {
			normalizeArray(userOptions.content, options.content, "asText");
			normalizeArray(userOptions.content, options.content, "asBinary");
		}

		libTools.merge(userOptions, options);
	}

	if (path[path.length - 1] !== libPath.sep) {
		path += libPath.sep;
	}

	setupFn(options.readdir);
	setupFn(options.stat);
	setupFn(options.content);

	return doReadDir(path, options, function (err, results) {
		if (err) {
			return callback && callback(err);
		}
		return callback && callback(null, results);
	});

	function normalizeSection(section) {
		if (libTools.isBoolean(section)) {
			return {
				enabled: section
			};
		}
		if (libTools.isAnonObject(section) && !libTools.isBoolean(section.enabled)) {
			section.enabled = true;
		}
		return section;
	}

	function setupFn(opts) {
		if (!opts.fn) {
			opts.fn = options.sync ? opts.fnSync : opts.fnAsync;
		}
		if (options.sync) {
			opts.fn = libTools.syncWrapper(opts.fn);
		}
	}

	function normalizeArray(target, source, property) {
		if (!target[property] || target[property] === true) {
			return;
		}
		if (!libTools.isArray(target[property])) {
			target[property] = [target[property]];
		}
		else if (target[property].length === 1 && libTools.isArray(target[property][0])) {
			// array wrapped in array, replaces source value
			target[property] = target[property][0];
		} else {
			target[property] = source[property].concat(target[property]);
		}
	}
}

readdirPlus.DEFAULT_OPTIONS = libVars.DEFAULT_OPTIONS;
readdirPlus.ERROR_STRATEGIES = libVars.ERROR_STRATEGIES;
readdirPlus.RETURN_TYPES = libVars.RETURN_TYPES;
readdirPlus.ReaddirPlusFile = libVars.ReaddirPlusFile;

module.exports = readdirPlus;