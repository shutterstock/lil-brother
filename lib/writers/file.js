var fs = require('fs');

var FileWriter = function(options) {

	var file_path = options['output-file'];

	if (!file_path) { throw "bad output file: " + file_path };

	this.stream = fs.createWriteStream(file_path, {'flags': 'a'}); 

	this.stream.on('error', function(e) {
		util.log("Error writing to file %s: %s", file_path, e);
	});

	this.write = function(data) {
		this.stream.write(data);
	};
};

module.exports = FileWriter;

