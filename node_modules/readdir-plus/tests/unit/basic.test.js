var libPath = require("path");

var readdir = require("../../lib/readdir-plus");

var rootSimple = libPath.resolve(__dirname + "/../root/simple");

module.exports = {
	canWorkWithDefaults: function (test) {
		test.expect(5);
		readdir(rootSimple, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 2);
			test.ok(results[0].stat);
			test.equal(results[0].name, "file1.txt");
			test.equal(results[1].name, "file2.txt");
			test.done();
		});
	},
	willReturnErrorForInvalidPath: function (test) {
		test.expect(1);
		readdir(rootSimple + "/not-there/", function (err, results) {
			test.ok(err instanceof Error);
			test.done();
		});
	},
	canReturnNames: function (test) {
		test.expect(4);
		readdir(rootSimple, { return: readdir.RETURN_TYPES.names }, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 2);
			test.equal(results[0], "file1.txt");
			test.equal(results[1], "file2.txt");
			test.done();
		});
	},
	canReturnRelativePaths: function (test) {
		test.expect(4);
		readdir(rootSimple, { return: readdir.RETURN_TYPES.relativePaths }, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 2);
			test.equal(results[0], "file1.txt");
			test.equal(results[1], "subdir1/file2.txt");
			test.done();
		});
	},
	canReturnFullPaths: function (test) {
		test.expect(4);
		readdir(rootSimple, { return: readdir.RETURN_TYPES.fullPaths }, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 2);
			test.equal(results[0], libPath.resolve(rootSimple, "file1.txt"));
			test.equal(results[1], libPath.resolve(rootSimple, "subdir1/file2.txt"));
			test.done();
		});
	},
	canExcludeDirsWhenRecursing: function (test) {
		test.expect(3);
		readdir(rootSimple, {excludeDirs: ["subdir1"]}, function (err, results) {
			test.equal(err, null);
			test.equal(results.length, 1);
			test.equal(results[0].name, "file1.txt");

			test.done();
		});
	}
};