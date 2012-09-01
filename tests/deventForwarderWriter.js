var http = require('http');

var lilbro = require('../lib/lilbro');
var fixtures = require('./data/fixtures');

exports.event = function(test) {

	var options = clone(fixtures.defaults);

	options.writer = 'devent-forwarder';
	options['devent-host'] = 'localhost';
	options['devent-port'] = 11991;

	lilbro.initialize(options);

	var req = { url: fixtures.encodedRequestURL, method: 'GET' };

	var res = {
		write: function() {},
		end: function() {},
		writeHead: function() {}
	};

	var devent_listener = function(req, res) {

		var chunks = [];
		var body_len = 0;

		req.on('data', function(chunk) {
			body_len += chunk.length;
			chunks.push(chunk);
		});

		req.on('end', function() {

			var body = new Buffer(body_len);
			var cur_len = 0;

			for (var i = 0; i < chunks.length; i++) {
				chunks[i].copy(body, cur_len);
				cur_len += chunks[i].length;
			}

			// test content type, method
			test.equal(req.method, 'POST', 'devent forwarder is a POST');
			test.equal(req.headers['content-type'], 'application/json', 'devent forwarder gets application/json content type');

			var data = decodeURIComponent(body.toString());

			test.deepEqual( JSON.parse(data), JSON.parse(fixtures.jsonData), 'event data makes it to devent-forwarder' );
			test.done();

			server.close();
			res.end();
		});

	};

	var server = http.createServer(devent_listener);
	server.listen(options['devent-port']);

	lilbro.listener(req, res);

};

var clone = function(object) {
	return JSON.parse(JSON.stringify(object));
}
