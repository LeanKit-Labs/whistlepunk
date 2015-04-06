describe( "Built-in Adapters", function() {

	describe( "when using the stdOut adapter", function() {

		describe( "when debug is not enabled", function() {
			describe( "with default timestamp", function() {

				var logFactory, logger, consoleLog, msg, noMsg, wp, timestamp, realLog;
				before( function() {
					msg = "Testing stdOut";
					timestamp = /[0-9]{4}[-][0-9]{2}[-][0-9]{2}T[0-9]{2}[:][0-9]{2}[:][0-9]{2}[.][0-9]{3}Z/;
					noMsg = "Shouldn't show up";
					wp = getWhistlepunk();
					realLog = console.log;
					console.log = function() {};
					consoleLog = sinon.spy( console, "log" );
					logFactory = wp( postal, {
						adapters: {
							stdOut: {
								level: 2
							}
						}
					} );
					logger = logFactory( "stdout-test" );
					logger.warn( msg );
					logger.info( noMsg );
					consoleLog.restore();
					console.log = realLog;
				} );

				after( function() {
					logger.reset();
					postal.reset();
				} );

				it( "should log the message to the console (with ISO8601 in GMT)", function() {
					var count = consoleLog.callCount;
					var regex = new RegExp( msg );
					var pass = false;

					var arg;
					for (var i = 0; i < count; i++) {
						arg = consoleLog.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) && timestamp.test( arg ) ) {
							pass = true;
						}
					}

					pass.should.be.ok;
				} );

				it( "should not log any statements above its level", function() {
					var count = consoleLog.callCount;
					var regex = new RegExp( noMsg );
					var pass = true;

					var arg;
					for (var i = 0; i < count; i++) {
						arg = consoleLog.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) ) {
							pass = false;
						}
					}

					pass.should.be.ok;
				} );
			} );

			describe( "with custom timestamp", function() {

				var logFactory, logger, consoleLog, msg, noMsg, wp, timestamp, realLog;
				before( function() {
					msg = "Testing stdOut";
					timestamp = /[0-9]{1,2}[:][0-9]{2}[ ](AM|PM)[ ][-][ ][a-zA-Z]{3}[ ][0-9]{1,2}[a-z]{2,3}[,][ ][0-9]{4}[-+][0]{4}/;
					noMsg = "Shouldn't show up";
					wp = getWhistlepunk();
					realLog = console.log;
					console.log = function() {};
					consoleLog = sinon.spy( console, "log" );
					logFactory = wp( postal, {
						adapters: {
							stdOut: {
								level: 2,
								timestamp: {
									format: "h:mm A - MMM Do, YYYYZZ"
								}
							}
						}
					} );
					logger = logFactory( "stdout-test" );
					logger.warn( msg );
					logger.info( noMsg );
					consoleLog.restore();
					console.log = realLog;
				} );

				after( function() {
					logger.reset();
					postal.reset();
				} );

				it( "should log the message to the console (with custom in GMT)", function() {
					var count = consoleLog.callCount;
					var regex = new RegExp( msg );
					var pass = false;

					var arg;
					for (var i = 0; i < count; i++) {
						arg = consoleLog.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) && timestamp.test( arg ) ) {
							pass = true;
						}
					}

					pass.should.be.ok;
				} );

				it( "should not log any statements above its level", function() {
					var count = consoleLog.callCount;
					var regex = new RegExp( noMsg );
					var pass = true;

					var arg;
					for (var i = 0; i < count; i++) {
						arg = consoleLog.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) ) {
							pass = false;
						}
					}

					pass.should.be.ok;
				} );
			} );

			describe( "with custom timestamp", function() {

				var logFactory, logger, consoleLog, msg, noMsg, wp, timestamp, realLog;
				before( function() {
					msg = "Testing stdOut";
					timestamp = /[0-9]{1,2}[:][0-9]{2}[ ](AM|PM)[ ][-][ ][a-zA-Z]{3}[ ][0-9]{1,2}[a-z]{2,3}[,][ ][0-9]{4}[-+][0-9][1-9][0-9]{2}/;
					noMsg = "Shouldn't show up";
					wp = getWhistlepunk();
					realLog = console.log;
					console.log = function() {};
					consoleLog = sinon.spy( console, "log" );
					logFactory = wp( postal, {
						adapters: {
							stdOut: {
								level: 2,
								timestamp: {
									local: true,
									format: "h:mm A - MMM Do, YYYYZZ"
								}
							}
						}
					} );
					logger = logFactory( "stdout-test" );
					logger.warn( msg );
					logger.info( noMsg );
					consoleLog.restore();
					console.log = realLog;
				} );

				after( function() {
					logger.reset();
					postal.reset();
				} );

				it( "should log the message to the console (with custom in GMT)", function() {
					var count = consoleLog.callCount;
					var regex = new RegExp( msg );
					var pass = false;

					var arg;
					for (var i = 0; i < count; i++) {
						arg = consoleLog.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) && timestamp.test( arg ) ) {
							pass = true;
						}
					}

					pass.should.be.ok;
				} );

				it( "should not log any statements above its level", function() {
					var count = consoleLog.callCount;
					var regex = new RegExp( noMsg );
					var pass = true;

					var arg;
					for (var i = 0; i < count; i++) {
						arg = consoleLog.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) ) {
							pass = false;
						}
					}

					pass.should.be.ok;
				} );
			} );

			describe( "with multiple topics and loggers", function() {

				var logFactory, logger, consoleLog, msg, noMsg, wp, timestamp;
				var filter = /(?:\S+\s){2}([a-zA-Z0-9.]+)/;
				var realLog;
				before( function() {
					msg = "Testing stdOut";
					wp = getWhistlepunk();
					realLog = console.log;
					console.log = function() {};
					consoleLog = sinon.spy( console, "log" );
					logFactory = wp( postal, {
						adapters: {
							stdOut: {
								level: 2,
								topic: [ "one.#", "two.#" ]
							}
						}
					} );
					var logger1a = logFactory( "one.a.test" );
					var logger1b = logFactory( "one.b.test" );
					var logger2a = logFactory( "two.a.test" );
					var logger2b = logFactory( "two.b.test" );
					var ignored = logFactory( "three" );

					// log entries that should show up
					logger1a.error( "one.a.error.1" );
					logger1a.warn( "one.a.warn.1" );
					logger1b.error( "one.b.error.1" );
					logger1b.warn( "one.b.warn.1" );
					logger2a.error( "two.a.error.1" );
					logger2a.warn( "two.a.warn.1" );
					logger2b.error( "two.b.error.1" );
					logger2b.warn( "two.b.warn.1" );

					// remove adapters from loggers with like topics
					logger2b.reset();

					// make a second set of writes
					logger1a.error( "one.a.error.2" );
					logger1a.warn( "one.a.warn.2" );
					logger1b.error( "one.b.error.2" );
					logger1b.warn( "one.b.warn.2" );

					// log entries that should not show up
					logger1a.info( "one.a.info" );
					logger1a.debug( "one.a.info" );
					logger1b.info( "one.b.info" );
					logger1b.debug( "one.b.info" );
					logger2a.info( "two.a.info" );
					logger2a.debug( "two.a.info" );
					logger2b.info( "two.b.info" );
					logger2b.debug( "two.b.info" );
					logger2a.error( "two.a.error.2" );
					logger2a.warn( "two.a.warn.2" );
					logger2b.error( "two.b.error.2" );
					logger2b.warn( "two.b.warn.2" );
					ignored.error( "ignored.error" );
					ignored.warn( "ignored.warn" );
					ignored.info( "ignored.info" );
					ignored.debug( "ignored.debug" );

					logger1a.reset();
					logger1b.reset();
					consoleLog.restore();
					console.log = realLog;
				} );

				after( function() {
					postal.reset();
				} );

				it( "should log the correct number of messages", function() {
					consoleLog.callCount.should.equal( 12 );
				} );

				it( "should log the correct messages", function() {
					var messages = _.map( _.range( 0, consoleLog.callCount ), function( index ) {
						var txt = consoleLog.getCall( index ).args[ 0 ];
						if ( filter.test( txt ) ) {
							return filter.exec( txt )[ 1 ];
						}
					} );
					messages = _.filter( messages );
					messages.should.eql( [
						"one.a.error.1",
						"one.a.warn.1",
						"one.b.error.1",
						"one.b.warn.1",
						"two.a.error.1",
						"two.a.warn.1",
						"two.b.error.1",
						"two.b.warn.1",
						"one.a.error.2",
						"one.a.warn.2",
						"one.b.error.2",
						"one.b.warn.2"
					] );
				} );
			} );
		} );

		describe( "when debug is enabled", function() {
			var cleanWp, logFactory, logger, consoleLog, noMsg, DEBUG;
			before( function() {
				noMsg = "Shouldn't show up";
				DEBUG = process.env.DEBUG;
				process.env.DEBUG = true;
				cleanWp = getWhistlepunk();

				consoleLog = sinon.spy( console, "log" );
				logFactory = cleanWp( postal, {
					adapters: {
						stdOut: {
							level: 2,
							bailIfDebug: true
						}
					}
				} );
				logger = logFactory( "stdout-debug-test" );
				logger.error( noMsg );
			} );

			after( function() {
				logger.reset();
				postal.reset();
				process.env.DEBUG = DEBUG;
				consoleLog.restore();
			} );

			it( "should not log any statements", function() {
				var count = consoleLog.callCount;
				var regex = new RegExp( noMsg );
				var pass = true;

				var arg;
				for (var i = 0; i < count; i++) {
					arg = consoleLog.getCall( i ).args[ 0 ];
					if ( regex.test( arg ) ) {
						pass = false;
					}
				}

				pass.should.be.ok;
			} );
		} );
	} );

	describe( "when using the autohost adapter", function() {
		var logFactory, logger, errMsg, infoMsg, wp, fount, host;

		before( function() {
			errMsg = "Testing autohost err";
			infoMsg = "Testing autohost info";
			host = {
				notifyClients: sinon.stub()
			};

			fount = {
				resolve: function( name ) {
					return when( host );
				}
			};
			wp = getWhistlepunk();
			logFactory = wp( postal, {
				adapters: {
					autohost: {
						level: 4
					}
				}
			}, fount );
			logger = logFactory( "ah-test" );
			logger.error( errMsg );
			logger.info( infoMsg );
		} );

		after( function() {
			logger.reset();
			postal.reset();
		} );

		it( "should forward messages to autohost's clients", function( done ) {
			process.nextTick( function() {
				host.notifyClients.callCount.should.equal( 2 );
				var args = host.notifyClients.getCall( 0 ).args;
				args[ 0 ].should.equal( "error" );
				args[ 1 ].msg.should.equal( errMsg );

				var args2 = host.notifyClients.getCall( 1 ).args;
				args2[ 0 ].should.equal( "info" );
				args2[ 1 ].msg.should.equal( infoMsg );

				done();
			} );
		} );
	} );

	describe( "when using the debug adapter", function() {
		var logFactory, logger, errMsg, infoMsg, wp, req, messages, debug, DEBUG;
		before( function() {
			messages = [];
			errMsg = "Testing autohost err";
			infoMsg = "Testing autohost info";
			DEBUG = process.env.DEBUG;
			process.env.DEBUG = "debug-test";
			debug = require( "debug" );
			debug.log = sinon.stub( debug, "log" );
			wp = getWhistlepunk();
			logFactory = wp( postal, {
				adapters: {
					debug: {
						level: 4
					}
				}
			} );
			logger = logFactory( "debug-test" );
			logger.error( errMsg );
			logger.info( infoMsg );
		} );

		after( function() {
			process.env.DEBUG = DEBUG;
			debug.log.restore();
			logger.reset();
			postal.reset();
		} );

		it( "should output messages to the debug log", function() {
			debug.log.callCount.should.equal( 2 );
			debug.log.getCall( 0 ).args[ 1 ].should.equal( errMsg );
			debug.log.getCall( 1 ).args[ 1 ].should.equal( infoMsg );
		} );
	} );
} );
