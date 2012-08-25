var http = require('http');
var events = require('events');
var util = require('util');

var DeventForwarderWriter = function(options) {

	events.EventEmitter.call(this);

	this.agent = new http.Agent({ host: options["devent-host"], port: options["devent-port"] });
	this.agent.maxSockets = 512;

	this.request_options = {
		host: options["devent-host"],
		port: options["devent-port"],
		path: "/" + options["devent-topic"],
		method: "POST",
		agent: this.agent,
		headers: { "content-type": "application/json" }
	};

	this.on('data', function(data) {

		var req = http.request(this.request_options, function(res) {

			res.on("end", function() {
				if (res.statusCode !== 200) {
					util.log("bad response: " + res.statusCode);
				}
			});
		});

		req.on("error", function(e) {
			util.log("error posting to devent-forwarder" + e.toString());
		});

		req.end(JSON.stringify(data));
	});

	this.on('close', function() {
		// no-op
	});
};

util.inherits(DeventForwarderWriter, events.EventEmitter);

module.exports = DeventForwarderWriter;

