var zmq = require('zmq');
var util = require('util');

var DeventZMQWriter = function(options) {

	events.EventEmitter.call(this);

	var uri = 'tcp://' + [options['devent-host'], options['devent-port']].join(':');

	this.socket = zmq.socket('push');
	this.socket.bindSync(uri);

	this.on('data', function(data) {

		this.socket.send(options['devent-topic'], zmq.ZMQ_SNDMORE);
		this.socket.send(JSON.stringify(data));
	});

	this.on('close', function() {
		this.socket.close();
	});
};

util.inherits(DeventZMQWriter, events.EventEmitter);

module.exports = DeventZMQWriter;

