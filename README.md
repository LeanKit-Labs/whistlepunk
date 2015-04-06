# Whistlepunk

> *noun* - a lumberjack who operates the signal wire running to a donkey engine whistle.

## What Is It?
Logging.....sigh. It's necessary, but often intrusive, heavy-handed and cumbersome...or it's anemic and fails to satisfy the needs of Ops and Developers. Whistlepunk doesn't care about what logging tools you love to use. It just cares that it needs to "blow the whistle" (i.e. - indicate something should be logged). You can plug your favorite logging tool into whistlepunk by writing an adapter for it (which consists of susbcribing to the postal "log" channel and writing the published log messages to your preferred logging library). At LeanKit, we're using [debug]() a lot (during development) and then standard out for production logs - so whistlepunk has two adapters (currently) built-in.

## How Does it Work?
If whistlepunk knows about your adapter, then including a section for that adapter in your configuration will enable it. For example, this config enables the "stdOut" and "debug" built-in adapters:

```javascript
var config =  {
	adapters: {
		stdOut: {
			level: 5,
			bailIfDebug: true, // disables stdOut if DEBUG=* is in play
			timestamp: {
				local: true, // defaults to UTC
				format: "MMM-D-YYYY hh:mm:ss A" // ex: Jan 1, 2015 10:15:20 AM
			},
			topic: "#", // default topic
		},
		"debug": {
			level: 5
		}
	}
};
var postal = require("postal");
var logger = require("whistlepunk")(postal, config);

logger.warn("Watch it, I'm warning you!");
```

### Log Levels
The log levels available are specified as integers (as in the above `level` value under each adapter's configuration). Specifying a log level includes each level up to the level specified. For example, specifying a log level of "3" (info), will include warn (2) and error (1) log messages as well.

* 0 - off
* 1 - error
* 2 - warn
* 3 - info
* 4 - debug

### Topics
Topics provide a way for adapters to limit what log entries they accept based on the namespace of the logger publishing the log entry. Since `postal` is being used to handle this, AMQP style wildcards are a valid way to subscribe to parts of a namespace.

Be aware that when calling `reset` on a log, all adapter subscriptions that match the log's namespace will be unsubscribed.

__example topics__
```javascript
	topic: "#" // will subscribe to all logs
	topic: "autohost.#" // will subscribe to all autohost loggers
	topic: "#.errors" // would subscribe to any logger with a namespace ending in "error"
	topic: "myApp.#,autohost.#" // subscribes to `myApp.#` and `autohost.#`
	topic: [ "myApp.#", "autohost.#" ] // same as above but
```

### Timestamps
Whistlepunk uses moment.js to capture and format timestamps. Timestamps will default to Greenwich Mean Time and the ISO8601 format.

#### Whistlepunk Users
Adapters should support the `timestamp` property in their configuration. To learn how to provide custom formats for the timestamp in your log entries, see [moment.js](http://momentjs.com/docs/#/displaying/format/).

The timestamp property has the following properties:

```javascript
	{
		local: false, // default setting
		format: "YYYY-MM-DDTHH:mm:ss.SSSZ" // default setting
	}
```

#### Adapter Authors
Whistelpunk provides adapters with two fields that can be used to display a timestamp. The `timestamp` field is an ISO8601 string in GMT. The `utc` field is a moment instance in UTC that can be used to apply a user-supplied format.

A timeFormatter function that will adjust and format the timestamp according to the adapter's configuration will be passed to your adapter's constructor. It requires the configuration and data as arguments:

```javascript
var timestamp = formatter( config, data );
```

See the [stdOut adapter](/blob/master/src/adapters/stdOut.js) for an example use case.

### Using With autohost
It's possible to use autohost to emit log messages over websockets to a client. To do so, you need to ensure autohost is registered with its fount instances as "ah", and pass the autohost fount instance to whistlepunk:

```javascript
var config =  {
	adapters: {
		stdOut: {
			level: 5,
			bailIfDebug: true // disables stdOut if DEBUG=* is in play
		},
		"debug": {
			level: 5
		},
		autohost: {
			level: 5
		}
	}
};
// assuming autohost instance is assigned to a "host" variable
var logger = require("whistlepunk")(postal, config, host.fount);

logger.debug("More info than you'd typically want to sift through....");
```

### Custom Adapters
Whistlepunk adapters modules must meet the following criteria:

 * export a factory method that takes the adapter config
 * provide an onLog method it can call on entries
 * implement a singleton (requiring it multiple times should result in the same instance)

Optionally, your adapter module can:

 * provide an init method that returns a promise for asynchronous setup
 * provide a `constraint` predicate that filters log entries (one is provided by default that filters by level)
 * accept a fount instance as a second argument to the factory method

#### Debug adapter - synchronous example
```js
var debug = require( "debug" );
var namespaces = {};
var debugAdapter = {
	onLog: function( data ) {
		var debugNs = namespaces[ data.namespace ];
		if ( !debugNs ) {
			debugNs = namespaces[ data.namespace ] = debug( data.namespace );
		}
		debugNs( data.type, data.msg );
	}
};

// factory method returns the same instance every time
// this allows whistlepunk to prevent creating duplicate subscriptions
// which would cause duplicate log entries
module.exports = function( config ) {
	return debugAdapter;
};
```

#### Autohost Socket adapter - asynchronous example
```js
var noOpAdapter = { onLog: function() {} };
var adapter;

function createAhAdapter( fount ) {
	var host;

	return {
		// whistlepunk will call this when present
		// and cache log messages for this adapter
		// until the promise resolves
		init: function() {
			return fount.resolve( "ah" )
				.then( function( _host ) {
					host = _host;
				} );
		},
		onLog: function( data ) {
			if ( host && host.notifyClients ) {
				host.notifyClients( data.type, data );
			}
		}
	};
}

// because need fount to get a handle to the
// autohost instance, return a no-op adapter
// if it's missing
module.exports = function( config, formatter, fount ) {
	adapter = adapter || ( fount ? createAhAdapter( fount ) : noOpAdapter );
	return adapter;
};
```
