var lilbro = require('../lib/lilbro');
var fixtures = require('./data/fixtures');

exports.class = function(test) {

	test.ok(typeof lilbro === 'object', 'we have a lilbro');
	test.done();
};

exports.initialize = function(test) {

	lilbro.initialize(fixtures.defaults);
	test.ok(typeof lilbro === 'object', 'we have a lilbro');
	test.done();
};
