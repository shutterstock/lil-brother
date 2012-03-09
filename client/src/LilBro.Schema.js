(function(){

	var root = this;

	root.LilBro = root.LilBro || {};
	root.LilBro.Schema = {};

	root.LilBro.Schema.version = "default";

	root.LilBro.Schema.key_map  = {
		// leave slot 0 for the server timestamp
		version: 1,
		timestamp: 2,
		event_type: 3,
		visitor_id: 4,
		visit_id: 5,
		mouse_x: 6,
		mouse_y: 7,
		viewport_width: 8,
		viewport_height: 9,
		scroll_x: 10,
		scroll_y: 11,
		element_id: 12,
		element_id_from: 13,
		element_class: 14,
		element_class_from: 15,
		element_name: 16,
		element_tag: 17,
		element_type: 18,
		element_checked: 19,
		element_value: 20,
		element_x: 21,
		element_y: 22,
		browser: 23,
		browser_version: 24,
		operating_system: 25,
		request_path: 26
	};

	root.LilBro.Schema.type_map = {
		click: 1,
		page_load: 2,
		focusin: 3,
		focusout: 4
	};

}).call(this)

