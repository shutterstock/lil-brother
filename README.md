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

### LilBro Methods

##### write({ event_type: ..., ... }) 

Write an event to the server.  Parameters are merged in with the event on its way out.  For example, to fire off a page load event:

```javascript
lilBro.write({event_type: 'page_load'});
```

##### watch({ element: ..., callback: ... })

Listen for a specific event, and annotate the message with custom data.  For example:

```javascript
// register a click handler that snakes some data from the DOM and specifies the the event type.
// this wont bubble to the wrapper element being watched.
lilBro.watch({
  element: document.getElementById('search_button'),
  callback: function(e) {
    e.set('element_value', document.getElementById('search_term').value);
    e.set('event_type', 'search');
  }
});
```

## Server

Start up the node listener and write events to a log file:

```
$ bin/lilbro --output-file events.log
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

## Event Context

#### Clicks

When a click happens, we gather what context we can and send that along with the event.  If the target element has an `id` and/or a `class`, we note that.  Otherwise, we traverse up the DOM until we find a parent’s `id` or `class`.  We also grab the element tag name, X and Y mouse coordinates relative to the element and to the page, scroll positions, and input values if the element happened to be some sort of input field.

In addition to metadata around the event, we discover other attributes too: browser version, operating system, viewport width and height, request path, and some other bits.

#### Visits and Visitors

Of course clicks are part of larger hierarchy.  There are users behind these clicks, and users browse in sessions.  To tie events together, Lil Brother sets two cookies: a long-lived `visitor` cookie, and a short-lived `visit` cookie.  We send the values of these cookies along so that we can string events together and aggregate later.

## Event Schemas

To create the smallest request possible when writing events, Lil Brother de-couples the key-value pairs into a SOH-delimited list comprised of the values in the order specified in the schema's `key_map`. These values are sent to the server via an image request, which re-assembles the list back into key-value pairs and forwards the data to a backend writer.  Both the client code and server code require access to a schema file which allows them to disassemble the data and re-assemble them in the correct order.

Lil Brother comes with a [default schema](client/src/LilBro.Schema.js) which includes attributes for context around the click and context around the visit and visitor and their browser.  

To create additional or multiple schemas, add them under `client/src` with the naming scheme `LilBro.Schema.__VERSION__.js`, and then load the client library with a query string parameter that refers to that version with `?v=__VERSION__`.

## Authors

This library was developed by Douglas Hunter, Dave Kozma and Eric Smiling at [Shutterstock](http://www.shutterstock.com)

## License

Copyright (C) 2012 by Shutterstock Images, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
