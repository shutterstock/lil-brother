LilBro = window.LilBro || {};

LilBro = function(args) {

	var self = this;
	
	this.initialize = function (args) {
		if (args) {
			if (!args.server) { return }
			if (!args.element) { return }

			this.watch_container(args.element, args.watch_focus);

			this.freshEvent = function () {
				var base = {};
				if(args.event_base){
					for(var p in args.event_base){
						if(args.event_base.hasOwnProperty(p)){
							base[p] = args.event_base[p];
						}
					}
				}
				return new LilBro.Event({
					base: base,
					key_map: args.key_map || LilBro.Schema.key_map,
					type_map: args.type_map || LilBro.Schema.type_map,
					server: args.server,
					ssl_server: args.ssl_server,
					visit_id_cookie: args.visit_id_cookie || 'visit_id',
					visitor_id_cookie: args.visitor_id_cookie || 'visitor_id'
				});
			}
		} else {
			return;
		}

		if (sessionStorage && sessionStorage.getItem('lilbrobug' + window.location.protocol)) {
			var src = decodeURIComponent(sessionStorage.getItem('lilbrobug' + window.location.protocol));
			var bug = new Image();
			bug.onload = function () { 
				sessionStorage.removeItem('lilbrobug' + window.location.protocol); 
			};
			bug.src = src;
		}

		this.event = this.freshEvent();
	}

	this.watch_container = function (el, focus) {
		if (!el) { return }
		if (el.addEventListener) {
			el.addEventListener('click', _doer_maker('click'), false);
			if (focus) {
				el.addEventListener('focusin', _doer_maker('focusin'), false);
				el.addEventListener('focusout', _doer_maker('focusout'), false);
			}
		} else {
			el.attachEvent('onclick', _doer_maker('click'), false);
			if (focus) {
				el.attachEvent('onfocusin', _doer_maker('focusin'), false);
				el.attachEvent('onfocusout', _doer_maker('focusout'), false);
			}
		}
	}

	this.watch = function (args) {
		if (!args) { return }
		if (!args.element) { return }

		if (args.element.addEventListener) {
			args.element.addEventListener(
				'click', 
				_doer_maker('click', args.callback, args.bubble),
			 	false
			);
		} else {
			args.element.attachEvent(
				'onclick', 
				_doer_maker('click', args.callback, args.bubble),
			 	false
			);
		}
	}
	
	function _doer_maker (type, callback, bubble) {
		return function(ev) {
			if (!ev) { ev = window.event }
			var targ = self._findTarget(ev);
			self.event.fill({
				type: type, 
				event: ev, 
				target: targ
			});
			if (callback) {
				try { callback(self.event) } catch (e) {}
			}
			if (!bubble) {
				ev.cancelBubble = true;
				if (ev.stopPropagation) { ev.stopPropagation() }
			}
			self.event.write();
			self.event = self.freshEvent();
		};
	}

	this.write = function (obj) {
		self.event.fill();
		for (var key in obj) {
			self.event.set(key, obj[key]);
		}
		self.event.write();
		self.event = self.freshEvent();
	}
	
	// event target lifted from quirksmode
	this._findTarget = function (ev) {
		var targ;
		if (ev.target) {
			targ = ev.target;
		} else if (ev.srcElement) {
			targ = ev.srcElement;
		}
		// defeat Safari bug
		if (targ.nodeType == 3) {
			targ = targ.parentNode;
		}
		return targ;
	}

	this.initialize(args);
}

LilBro.Event = function (args) {

	this.initialize = function(args) {
		this._event = args.base;
		this._key_map = args.key_map;
		this._type_map = args.type_map;
		this.server = args.server;
		this.ssl_server = args.ssl_server;
		this.visit_id_cookie = args.visit_id_cookie;
		this.visitor_id_cookie = args.visitor_id_cookie;
	}

	this.set = function(prop, val) {
		return this._event[prop] = val;
	}

	this.get = function(prop) {
		return this._event[prop];
	}

	this.write = function() {
		var event = [];
		for (var key in this._key_map) {
			if (key === "event_type") {
				event[this._key_map[key]] = this._type_map[this.get(key)] || 0;
			} else {
				event[this._key_map[key]] = this.get(key) || "";
			}
		}
		var protocol = window.location.protocol;
		var src = protocol + '//'
		                + ((protocol === 'https:') ? this.ssl_server || this.server : this.server)
		                + '/'
		                + event.join('\x01')
		                + '.png?'
		                + this.randomHexBlocks(1);
		if (sessionStorage) {
			sessionStorage.setItem(
				'lilbrobug' + protocol,
				encodeURIComponent(src)
			);
		}
		var bug = new Image();
		bug.onload = function () { 
			sessionStorage.removeItem('lilbrobug' + protocol); 
		};
		bug.src = src;
	}

	this.fill = function (args) {
		
		//version
		this.set('version', LilBro.Schema.version);

		if (args && args.type) {
			// event type
			this.set('event_type', args.type);
		}

		if (args && args.event) {
			// mouse coordinates
			var mouse_x = '';
			var mouse_y = '';
			if (args.event.pageX || args.event.pageY) {
				mouse_x = args.event.pageX;
				mouse_y = args.event.pageY;
			}
			else if (args.event.clientX || args.event.clientY) {
				mouse_x = args.event.clientX + document.body.scrollLeft
					+ document.documentElement.scrollLeft;
				mouse_y = args.event.clientY + document.body.scrollTop
					+ document.documentElement.scrollTop;
			}
			this.set('mouse_x', mouse_x);
			this.set('mouse_y', mouse_y);
		}

		// viewport
		this.set('viewport_width', document.documentElement.clientWidth);
		this.set('viewport_height', document.documentElement.clientHeight);

		// scroll, snaked from http://webcodingeasy.com/Javascript/Get-scroll-position-of-webpage--crossbrowser
		var scroll_x = 0, scroll_y = 0;
		if(typeof(window.pageYOffset) == 'number') {
			scroll_x = window.pageXOffset;
			scroll_y = window.pageYOffset;
		} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			scroll_x = document.body.scrollLeft;
			scroll_y = document.body.scrollTop;
		} else if (document.documentElement && (document.documentElement.scrollLeft 
			                                      || document.documentElement.scrollTop)) {
			scroll_x = document.documentElement.scrollLeft;
			scroll_y = document.documentElement.scrollTop;
		}
		this.set('scroll_x', scroll_x || 0);
		this.set('scroll_y', scroll_y || 0);

		// element goodies
		if (args && args.target) {
			// element id and class, or their closest ancestors
			var el_id = args.target.id;
			var el_class = args.target.className;
			var id_from_ancestor = !el_id;
			var class_from_ancestor = !el_class;
			var id_path, class_path;
			if (!el_id || !el_class) {
				var targ_orig = args.target;
				id_path = args.target.tagName;
				class_path = args.target.tagName;
				do {
					args.target = args.target.parentNode;
					if (!el_id) {
						id_path = args.target.tagName + '/' + id_path;
						el_id = args.target.id;
					}
					if (!el_class) {
						class_path = args.target.tagName + '/' + class_path;
						el_class = args.target.className;
					}
				} while ((!el_id || !el_class)  &&  args.target.parentNode);
				args.target = targ_orig;
			}
			this.set('element_id', el_id);
			this.set('element_class', el_class);
			if (el_id && id_from_ancestor) {
				this.set('element_id_from', id_path);
			}
			if (el_class && class_from_ancestor) {
				this.set('element_class_from', class_path);
			}

			// element sundry
			this.set('element_name', args.target.name || '');
			this.set('element_tag', args.target.tagName || '');
			this.set('element_type', args.target.type || '');
			this.set('element_checked', args.target.checked ? 1 : '');
			// by default, ignore typed input
			if (args.target.type  &&  args.target.type.toLowerCase() !== 'text'
				       &&  args.target.type.toLowerCase() !== 'password') {
				this.set('element_value', args.target.value || '');
			}

			// including the position best effort (http://stackoverflow.com/a/442474)
			var element_x = 0;
			var element_y = 0;
			var targ_orig = args.target;
			while( args.target && !isNaN( args.target.offsetLeft ) && !isNaN( args.target.offsetTop ) ) {
				element_x += args.target.offsetLeft - args.target.scrollLeft;
				element_y += args.target.offsetTop - args.target.scrollTop;
				args.target = args.target.offsetParent;
			}
			args.target = targ_orig;
			this.set('element_x', element_x);
			this.set('element_y', element_y);
		}

		// browser
		if (LilBro.BrowserDetect) {
			this.set('browser', LilBro.BrowserDetect.browser);
			this.set('browser_version', LilBro.BrowserDetect.version);
			this.set('operating_system', LilBro.BrowserDetect.OS);
		}

		// path part of url
		this.set('request_path', window.location.pathname);

		// other client bits
		var d = new Date();
		this.set('timestamp', d.getTime());
		this.set('visitor_id', this.getVisitorId());
		this.set('visit_id', this.getVisitId());
	}

	this.getVisitorId = function () {
		var visitor_id = this.getCookie(this.visitor_id_cookie);
		if (!visitor_id) {
			visitor_id = this.randomHexBlocks(4);
		}
		this.setCookie(this.visitor_id_cookie, visitor_id, this.getVisitorExpiry());
		return visitor_id;
	}
	
	this.getVisitId = function () {
		var visit_id = this.getCookie(this.visit_id_cookie);
		if (!visit_id) { 
			visit_id = this.randomHexBlocks(4);
		}
		this.setCookie(this.visit_id_cookie, visit_id, this.getVisitExpiry());
		return visit_id;
	}

	this.getVisitorExpiry = function () {
		var d = new Date();
		                        // 90 days
		d.setTime(d.getTime() + (90 * 24 * 60 * 60 * 1000));
		return d.toGMTString();
	}

	this.getVisitExpiry = function () {
		var d = new Date();
		                        // 30 minutes
		d.setTime(d.getTime() + (30 * 60 * 1000));
		return d.toGMTString();

	}
	
	this.randomHexBlocks = function (blocks) {
		if (!blocks) { blocks = 4 }
		var hex = '';
		for (var i = 0; i < blocks; i++) {
			hex += parseInt(Math.random() * (Math.pow(2, 32))).toString(16);
		}
		return hex;
	}

	// cookies borrowed from quirksmode
	this.setCookie = function (name,value,expiry) {
		var expires;
		if (expiry) {
			expires = "; expires=" + expiry;
		} else {
			expires = "";
		}
		document.cookie = name+ "=" + value + expires + "; path=/";
	}

	this.getCookie = function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	this.initialize(args);
}

