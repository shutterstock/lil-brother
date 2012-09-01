var http = require('http');
var fs = require('fs');

var lilbro = require('../lib/lilbro');
var fixtures = require('./data/fixtures');

exports.missingOutputFile = function(test) {

	var options = clone(fixtures.defaults);
	options.writer = 'file';

	test.throws(function() { lilbro.initialize(options) }, Error, 'throws an error for no output file');
	test.done();
};

exports.event = function(test) {

	var outputFile = '/tmp/lilbro' + process.pid;

	var options = clone(fixtures.defaults);
	options.writer = 'file';
	options['output-file'] = outputFile;

	lilbro.initialize(options);

	var req = { url: fixtures.encodedRequestURL, method: 'GET' };

	var res = {
		write: function() {},
		end: function() {},
		writeHead: function() {}
	};

	lilbro.listener(req, res);

	setTimeout( function() {
		var fileData = fs.readFileSync(outputFile, 'utf8');
		test.deepEqual( JSON.parse(fileData), JSON.parse(fixtures.jsonData), 'event data makes it to file' );
		test.done();
	}, 500);
};

var clone = function(object) {
	return JSON.parse(JSON.stringify(object));
}
