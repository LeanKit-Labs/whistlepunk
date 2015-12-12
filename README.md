# Whistlepunk

[![Version npm](https://img.shields.io/npm/v/whistlepunk.svg?style=flat)](https://www.npmjs.com/package/whistlepunk)
[![npm Downloads](https://img.shields.io/npm/dm/whistlepunk.svg?style=flat)](https://www.npmjs.com/package/whistlepunk)
[![Dependencies](https://img.shields.io/david/LeanKit-Labs/whistlepunk.svg?style=flat)](https://david-dm.org/LeanKit-Labs/whistlepunk)

> *noun* - a lumberjack who operates the signal wire running to a donkey engine whistle.

## What Is It?
Logging.....sigh. It's necessary, but often intrusive, heavy-handed and cumbersome...or it's anemic and fails to satisfy the needs of Ops and Developers. Whistlepunk doesn't care about what logging tools you love to use. It just cares that it needs to "blow the whistle" (i.e. - indicate something should be logged). You can plug your favorite logging tool into whistlepunk by writing an adapter for it (which consists of susbcribing to the postal "log" channel and writing the published log messages to your preferred logging library). At LeanKit, we're using [debug]() a lot (during development) and then standard out for production logs - so whistlepunk has two adapters (currently) built-in.

## How Does it Work?
If whistlepunk knows about your adapter, then including a section for that adapter in your configuration will enable it. For example, this config enables the "stdOut" and "debug" built-in adapters:

```javascript
var postal = require("postal");
var whistlepunk = require("whistlepunk");

var config =  {
	adapters: {
		stdOut: {
			level: 4,
			bailIfDebug: true, // disables stdOut if DEBUG=* is in play
			timestamp: {
				local: true, // defaults to UTC
				format: "MMM-D-YYYY hh:mm:ss A" // ex: Jan 1, 2015 10:15:20 AM
			},
			topic: "#", // default topic
		},
		"debug": {
			level: 4
		}
	}
};

var loggerFactory = whistlepunk(postal, config);

var logger = loggerFactory();
logger.warn("Watch it, I'm warning you!");
```

### Alternate API
A common use case we've run into is that multiple modules need logging but a dependency on a shared loggerFactory instance gets cumbersome and introduces limitations in setup due to temporal coupling.

Whistlepunk now provides a singleton log instance that you can provide configuration to even after log instances have been created. Any calls to these uninitialized logs will simply no-op until some configuration has been provided.

This also supports use cases where you may want to change log configuration during the lifetime of the application.

```javascript
var whistlepunk = require("whistlepunk").log;

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

var logger = whistlepunk( "my.topic" );
logger.warn( "no configuration was provided, no one will see this" );
whistlepunk( config );
logger.info( "now that an adapter was added, this will show up" );

// creating additional log instances that use different topics
// is simple and doesn't require you to provide the configuration
// nor do you need to carry around the same loggerFactory instance.
var altLogger = whistlepunk( "off.topic" );
altLogger.info( "that reminds me ..." );
```

Any other module can get access to the same log factory by using `require( "whistlepunk" ).log;` and not need to pass around shared references.

The trade-off for these features is that you _can_ create a race condition in your setup where some log entries could no-op. Careful planning in how you initialize will avoid this problem.

## Configuration

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
var postal = require("postal");
var whistlepunk = require("whistlepunk");

var config =  {
	adapters: {
		stdOut: {
			level: 4,
			bailIfDebug: true // disables stdOut if DEBUG=* is in play
		},
		"debug": {
			level: 4
		},
		autohost: {
			level: 4
		}
	}
};
// assuming autohost instance is assigned to a "host" variable
var loggerFactory = whistlepunk(postal, config, host.fount);

var logger = loggerFactory();
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
