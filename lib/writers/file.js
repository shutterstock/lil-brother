var fs = require('fs');
var events = require('events');
var util = require('util');

var FileWriter = function(options) {

	events.EventEmitter.call(this);

	var file_path = options['output-file'];
	if (!file_path) { throw new Error("bad output file: " + file_path) };

	this.stream = fs.createWriteStream(file_path, {'flags': 'a'});

	this.stream.on('error', function(e) {
		util.log("Error writing to file %s: %s", file_path, e);
	});

	this.on('data', function(data) {
		this.stream.write(JSON.stringify(data) + "\n");
	});

	this.on('close', function(data) {
		this.stream.close();
	});
};

util.inherits(FileWriter, events.EventEmitter);

module.exports = FileWriter;

