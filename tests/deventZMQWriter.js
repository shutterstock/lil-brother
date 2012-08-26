var http = require('http');
var zmq = require('zmq');

var lilbro = require('../lib/lilbro');
var fixtures = require('./data/fixtures');

exports.event = function(test) {

	var options = clone(fixtures.defaults);

	options.writer = 'devent-zmq';
	options['devent-host'] = '127.0.0.1';
	options['devent-port'] = 11991;

	lilbro.initialize(options);

	var req = { url: fixtures.encodedRequestURL, method: 'GET' };

	var res = {
		write: function() {},
		end: function() {},
		writeHead: function() {}
	};

	var uri = 'tcp://' + [options['devent-host'], options['devent-port']].join(':');

	var puller = zmq.socket('pull');
	puller.connect(uri);

	puller.on('message', function(topic, data) {

		test.equal( topic, 'lilbro', 'devent zmq topic is lilbro' );

		test.deepEqual( JSON.parse(data), JSON.parse(fixtures.jsonData), 'event data makes it to devent-zmq' );
		test.done();

		puller.close();
		lilbro.close();
	});

	lilbro.listener(req, res);
};

var clone = function(object) {
	return JSON.parse(JSON.stringify(object));
}
