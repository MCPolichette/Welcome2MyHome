var libPath = require("path"),
	Buffer = require("buffer").Buffer;

var libTools = require("../../lib/tools"),
	readdir = require("../../lib/readdir-plus");

var rootSimple = libPath.resolve(__dirname + "/../root/simple"),
	rootAdvanced = libPath.resolve(__dirname + "/../root/advanced");

module.exports = {
	setUp: libTools.execOrDie.bind(null, libPath.resolve(__dirname, "../root/setup.sh")),
	tearDown: libTools.execOrDie.bind(null, libPath.resolve(__dirname, "../root/teardown.sh")),

	canLoadContentWithDefaultSettings: function (test) {
		test.expect(3);
		readdir(rootSimple, {stat: false, content: true}, function (err, results) {
			test.equal(err, null);
			test.equal(results[0].content, "simple1");
			test.strictEqual(results[1].content, "");
			test.done();
		});
	},
	canDistinguishBetweenTextAndBinaries: function (test) {
		test.expect(7);
		var opts = {
			stat: false,
			content: {
				asText: [function (f) {
					// Treat files without extension as text files (in addition to others)
					return !f.extension;
				}],
				asBinary: /.*/
			}
		};
		readdir(rootAdvanced, opts, function (err, results) {
			test.equal(err, null);
			results.forEach(function (file) {
				if (file.name === "file3.bin" || file.name === "file1.lnk") {
					test.ok(file.content instanceof Buffer);
				}
				else {
					test.ok(libTools.isString(file.content));
				}
			});
			test.done();
		});
	},
	willSkipOverTooLargeFiles: function (test) {
		test.expect(4);
		readdir(rootSimple, { content: { maxSize: 5 }}, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 2);
			test.strictEqual(results[0].content, undefined);
			test.ok(libTools.isString(results[1].content));
			test.done();
		});
	}
};