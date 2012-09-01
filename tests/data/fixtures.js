module.exports = {

	encodedRequestURL: '/%01default%011345738072767%010%011649295%0189c659cf3c9c7588e9b459923d048f17%01%01%011905%01386%01%01%01%01%01%01%01%01%01%01%01%01%01%01Chrome%0112%01Linux%01/rickshaw/.png?f07a745a',

	jsonData: '{"version":"default","timestamp":"1345738072767","event_type":"0","visitor_id":"1649295","visit_id":"89c659cf3c9c7588e9b459923d048f17","mouse_x":"","mouse_y":"","viewport_width":"1905","viewport_height":"386","scroll_x":"","scroll_y":"","element_id":"","element_id_from":"","element_class":"","element_class_from":"","element_name":"","element_tag":"","element_type":"","element_checked":"","element_value":"","element_x":"","element_y":"","browser":"Chrome","browser_version":"12","operating_system":"Linux","request_path":"/rickshaw/"}',

	defaults: {
		'png-bug': './data/b.png',
		'https-port': false,
		'https-key': './data/test-cert/privatekey.pem',
		'https-cert': './data/test-cert/certificate.pem',
		'http-port': 8000,
		'devent-host': 'prod-deventforwarder01.nyc01',
		'devent-port': 7664,
		'devent-topic': 'lilbro',
		'client-js-path': './client/src/',
		writer: 'devent-forwarder',
		'output-file': false
	}
};
