# Li'l Brother

Li'l Brother tracks clicks on web pages, without blocking any interaction.

## Client

Include the library:
```
<script type="text/javascript" src="http://server/lilbro.js"></script>
```

Listen for clicks on the body:
```javascript
var lilBro = new LilBro({
  element: document.body,
  server: 'server:8000',
  ssl_server: 'server:8443',
  track_focus: true
});
```

Alternatively, listen for a specific event, and annotate the message with custom data:

```javascript
// register a click handler that snakes some data from the DOM,
// and specifies the the event type.
// This wont bubble to the wrapper element being watched.
lilBro.watch({
  element: document.getElementById('search_button'),
  callback: function(e) {
    e.set(
      'element_value',
      document.getElementById('search_term').value
    );
   	e.set('event_type', 'search');
  }
});
```

Or fire an event, right now:

```javascript
lilBro.write({event_type: 'page_load'});
```

### LilBro Options

##### element

Reference to top-level container element to monitor for events. 

##### server

Server to communicate with over HTTP calls.

##### server_ssl

Server to communicate with over HTTPS calls.

##### visit_id_cookie, visitor_id_cookie

Custom cookie names for visit and visitor cookies. Defaults to `visit_id` and `visitor_id`. 

##### watch_focus

If set to true, will log focus/blur events that occur.

##### event_base

Optional base template object for events; useful for attatching extra metadata.

## Server

Start up the node listener and write events to a log file:

```
$ bin/lilbro --output-file lilb.log
```

#### Usage Options

```
$ bin/lilbro --help

Usage: node lilbro [options]

Options:
   --png-bug FILE                                path to the image file to return to clients
   --https-port PORT                             port to listen for https connections
   --https-key FILE                              path to the file containing the private key
   --https-cert FILE                             path to the file containing the secure certificate
   --http-port PORT                              port to listen on
   --devent-host HOST                            devent hostname
   --devent-port PORT                            devent port
   --devent-topic STRING                         devent topic to write events to when writing to devent
   --client-js-path DIR                          path to find client library sources
   --writer [file|devent-zmq|devent-forwarder]   method to use for writing events
   --output-file FILE                            path to log to when writing events to file

```

#### Devent

To write to Devent, use `--writer devent-zmq` or `--writer devent-forwarder`.  See [devent-router](https://github.com/shutterstock/devent-router) and [devent-forwarder](https://github.com/shutterstock/devent-forwarder).

## Authors

This library was developed by Douglas Hunter, Dave Kozma and Eric Smiling at [Shutterstock](http://www.shutterstock.com)

## License

Copyright (C) 2012 by Shutterstock Images, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
