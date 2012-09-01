var fs = require("fs")
	, http = require("http")
	, https = require("https")
	, path = require("path")
	, url = require("url")
	, events = require("events")
	, util = require("util");

var loaded_schemas = {};
var bad_schemas = {};

function load_schema(vstring) {

	if (bad_schemas[vstring]) {
		return;
	}
	if (loaded_schemas[vstring]) {
		return loaded_schemas[vstring];
	}

	try {
		var rev_key_map = {};
		var vlib = vstring === "default" ? "LilBro.Schema" : "LilBro.Schema." + vstring;
		var lbs = require(path.resolve(client_js_path, vlib));

		for (var key in lbs.LilBro.Schema.key_map) {
			rev_key_map[lbs.LilBro.Schema.key_map[key]] = key;
		}

		loaded_schemas[vstring] = rev_key_map;
		return loaded_schemas[vstring];

	} catch (e) {
		bad_schemas[vstring] = true;
	}
}

var https_opts = {};
var js_bundles = {};

var bug,
    client_js_path,
    post_opts,
    server,
    secure_server;

exports.initialize = function(options) {

	bug = fs.readFileSync(options["png-bug"]);
	client_js_path = options["client-js-path"];
	https_opts.key = fs.readFileSync(options["https-key"]),
	https_opts.cert = fs.readFileSync(options["https-cert"]);

	js_bundles["shared"] = fs.readFileSync(path.join(client_js_path, "LilBro.js"));
	js_bundles["shared"] += fs.readFileSync(path.join(client_js_path, "LilBro.BrowserDetect.js"));
	js_bundles["default"] = fs.readFileSync(path.join(client_js_path, "LilBro.Schema.js"));

	module.exports.server = server = http.createServer(listener);
	module.exports.secure_server = secure_server = https.createServer(https_opts, listener);

	server.on("clientError", function (e) {
		util.log("client error: " + e.toString());
	});

	secure_server.on("clientError", function (e) {
		util.log("client error: " + e.toString());
	});

	var Writer = require("./writers/" + options.writer);
	writer = new Writer(options);
};

var listener = exports.listener = function(req, res) {

	if (req.method !== "GET") {
		respond_with(res, 400);
		return;
	}
	var parsed = url.parse(req.url, true);
	if (parsed.pathname === "/favicon.ico") {
		respond_with(res, 404);
		return;
	}
	if (parsed.pathname === "/lilbro.js" || parsed.pathname === "/lilbro.min.js") {
		serve_client_javascript(parsed, res);
		return;
	}
	if (parsed.pathname === "/healthcheck.html") {
		respond_with(res, 200, "YESOK");
		return;
	}

	res.writeHead(200, {
		"Content-Length": bug.length,
		"Content-Type": "image/png",
		"Pragma": "no-cache",
		"Cache-Control": "must-revalidate"
	});
	res.end(bug);

	var event = parsed.pathname.substring(1, parsed.pathname.length - 4);
	log_event(event);
}

var close = exports.close = function() {
	writer.emit('close');
};


var serve_client_javascript = function(parsed_url, res) {

	var version = parsed_url.query.v || "default";

	if (!js_bundles[version]) {
		fs.readFile(path.join(client_js_path, "LilBro.Schema." + version + ".js"), function(err, data) {
			// TODO cache bad versions to avoid stat
			if (err) {
				res.writeHead(404);
				res.end("404 Not Found");
				return;
			}
			js_bundles[version] = data;
			var expires = new Date;
			expires.setTime(expires.getTime() + (90 * 24 * 60 * 60 * 1000));
			res.writeHead(200, {
				"Content-Type": "application/javascript",
				"Expires": expires.toGMTString()
			});
			res.end(js_bundles["shared"] + js_bundles[version]);
		});
	} else {
		var expires = new Date;
		expires.setTime(expires.getTime() + (90 * 24 * 60 * 60 * 1000));
		res.writeHead(200, {
			"Content-Type": "application/javascript",
			"Expires": expires.toGMTString()
		});
		res.end(js_bundles["shared"] + js_bundles[version]);
	}
}

var log_event = function(encodedEvent) {

	try {
		var items = decodeURIComponent(encodedEvent).split("\x01");

	} catch (err) {
		if (err) {
			util.log("could not decode event string: " + err.toString());
			return;
		}
	}

	var schema = load_schema(items[1]);
	if (!schema) return;

	var event = {};
	for (var i = 1; i < items.length; i++) {
		event[schema[i]] = items[i];
	}

	writer.emit('data', event);
}

function respond_with(res, code, mess) {
	res.statusCode = code;
	res.write(mess || code.toString());
	res.end();
}
