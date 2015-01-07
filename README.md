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
