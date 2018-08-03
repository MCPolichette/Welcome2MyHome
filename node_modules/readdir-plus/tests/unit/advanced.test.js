var libPath = require("path");

var libTools = require("../../lib/tools"),
	readdir = require("../../lib/readdir-plus");

var rootSimple = libPath.resolve(__dirname + "/../root/simple"),
	rootAdvanced = libPath.resolve(__dirname + "/../root/advanced");

module.exports = {
	setUp: libTools.execOrDie.bind(null, libPath.resolve(__dirname, "../root/setup.sh")),
	tearDown: libTools.execOrDie.bind(null, libPath.resolve(__dirname, "../root/teardown.sh")),
	canWorkWithoutStatForSimplestRequests: function (test) {
		test.expect(2);
		var options = {
			filter: true,
			recursive: false,
			stat: {
				enabled: false,
				errorStrategy: readdir.ERROR_STRATEGIES.fatal,
				fn: function (_, cb) {
					cb(new Error("This shouldn't be called"));
				}
			}
		};
		readdir(rootAdvanced, options, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 7);
			test.done();
		});
	},
	canDetermineFileType: function (test) {
		test.expect(5);
		readdir(rootAdvanced, {stat: true, filter: true}, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 10);
			results.forEach(function (result) {
				if (result.name === "file1.txt") {
					test.ok(result.type, "file");
				}
				if (result.name === "sub1") {
					test.ok(result.type, "directory");
				}
				if (result.name === "file1.lnk") {
					test.ok(result.type, "symbolicLink");
				}
			});
			test.done();
		});
	},
	canProduceTreeWithDetailsReturnType: function (test) {
		test.expect(9);
		readdir(rootAdvanced, {tree: true, stat: false}, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 6);

			results.forEach(function (result) {
				if (result.name === "sub1") {
					test.equal(result.content.length, 2);
				}
				else if (result.name === "sub500") {
					test.equal(result.content.length, 1);
					test.equal(result.content[0].name, "hidden3.txt");
				}
				else if (result.name === "sub400") {
					test.equal(result.content.length, 0);
				}
				else {
					test.equal(!!result.content, false);
				}
			});
			test.done();
		});
	},
	canProduceTreeWithOtherReturnTypes: function (test) {
		test.expect(10);
		readdir(rootAdvanced, {tree: true, stat: false, return: "names"}, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 6);

			var subHash = {};
			results.forEach(function (result) {
				if (libTools.isAnonObject(result)) {
					test.ok(libTools.isString(result.name));
					for (var i = 0; i < result.content.length; i++) {
						var subHashKey = String(result.content[i]);
						subHash[subHashKey] = (subHash[subHashKey] || 0) + 1;
					}
				} else {
					test.ok(libTools.isString(result));
				}
			});
			test.equal(subHash["file3.bin"], 1);
			test.equal(subHash["hidden3.txt"], 1);

			test.done();
		});
	}
};