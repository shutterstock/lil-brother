var zmq = require('zmq');
var util = require('util');


var DeventZMQWriter = function(options) {

	this.socket = zmq.socket('push');
	this.socket.connect(uri);

	this.write = function(topic, message) {

		if (!topic || !message) {
			util.log("bad write_devent, need topic and message");
			return;
		}

		this.socket.send(topic, zmq.ZMQ_SNDMORE);
		this.socket.send(message);
	};

};

module.exports = DeventZMQWriter;

