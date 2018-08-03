var libPath = require("path");

var readdir = require("../../lib/readdir-plus");

var rootSimple = libPath.resolve(__dirname + "/../root/simple");

module.exports = {
	canRunBasicSynchronousRequests: function (test) {
		test.expect(10);
		var asyncResults = null;
		var syncResults = readdir(rootSimple, { sync: true }, function (err, results) {
			test.equal(err, null);
			asyncResults = results;
		});

		checkResults(asyncResults);
		checkResults(syncResults);
		test.strictEqual(syncResults, asyncResults);
		test.done();

		function checkResults(results) {
			test.equal(results.length, 2);
			test.ok(results[0].stat);
			test.equal(results[0].name, "file1.txt");
			test.equal(results[1].name, "file2.txt");
		}
	},
	canThrowExceptionInCaseOfErrors: function (test) {
		test.expect(1);

		test.throws(readdir("non-existant"));

		test.done();
	}
};