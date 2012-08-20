var http = require('http');

var DeventForwarderWriter = function(options) {

	this.agent = new http.Agent({host: options["devent-host"], port: options["devent-port"]});
	this.agent.maxSockets = 512;

	this.post_options = {
		host: options["devent-host"],
		port: options["devent-port"],
		path: "/" + options["devent-topic"],
		method: "POST",
		agent: this.agent,
		headers: { "content-type": "application/json" }
	};

	this.write = function(data) {

		var req = http.request(this.post_options, function(res) {

			res.on("end", function () {
				if (res.statusCode !== 200) {
					util.log("bad response: " + res.statusCode);
				}
				return;
			});
		});

		req.on("error", function (e) {
			util.log("error posting to devent-forwarder" + e.toString());
			return;
		});

		req.end(data);
	};

};

module.exports = DeventForwarderWriter;

