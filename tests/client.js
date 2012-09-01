var lilbro = require('../lib/lilbro');
var fixtures = require('./data/fixtures');

exports.clientjs = function(test) {


	var req = { url: '/lilbro.js', method: 'GET' };

	var res = {
		write: function() {},
		end: function(data) {
			test.equal(data.substring(0,6), 'LilBro', 'we get reasonable content back for client js');
			test.done();
		},
		writeHead: function(status, headers) {
			test.equal(status, 200, 'client js response has 200');
			test.equal(headers['Content-Type'], 'application/javascript', 'client js request has good content type headers')
		}
	};

	lilbro.initialize(fixtures.defaults);
	lilbro.listener(req, res);
};
