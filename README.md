#Whistlepunk

> *noun* - a lumberjack who operates the signal wire running to a donkey engine whistle.

##What Is It?
Logging.....sigh. It's necessary, but often intrusive, heavy-handed and cumbersome...or it's anemic and fails to satisfy the needs of Ops and Developers. Whistlepunk doesn't care about what logging tools you love to use. It just cares that it needs to "blow the whistle" (i.e. - indicate something should be logged). You can plug your favorite logging tool into whistlepunk by writing an adapter for it (which consists of susbcribing to the postal "log" channel and writing the published log messages to your preferred logging library). At LeanKit, we're using [debug]() a lot (during development) and then standard out for production logs - so whistlepunk has two adapters (currently) built-in.

##How Does it Work?
If whistlepunk knows about your adapter, then including a section for that adapter in your configuration will enable it. For example, this config enables the "stdOut" and "debug" built-in adapters:

```javascript
var config =  {
	adapters: {
		stdOut: {
			level: 5,
			bailIfDebug: true // disables stdOut if DEBUG=* is in play
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

###Log Levels
The log levels available are specified as integers (as in the above `level` value under each adapter's configuration). Specifying a log level includes each level up to the level specified. For example, specifying a log level of "3" (info), will include warn (2) and error (1) log messages as well.

* 0 - off
* 1 - error
* 2 - warn
* 3 - info
* 4 - debug

###Using With autohost
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

###Custom Adapters
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
module.exports = function( config, fount ) {
	adapter = adapter || ( fount ? createAhAdapter( fount ) : noOpAdapter );
	return adapter;
};
```
