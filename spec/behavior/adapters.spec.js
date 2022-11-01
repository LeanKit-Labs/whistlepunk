"use strict";

describe( "Built-in Adapters", function() {
	describe( "when using the stdOut adapter", function() {
		describe( "when debug is not enabled", function() {
			describe( "with default timestamp", function() {
				let logFactory, logger, consoleWarn, msg, noMsg, wp, timestamp;
				before( function() {
					msg = "Testing stdOut";
					timestamp = /[0-9]{4}[-][0-9]{2}[-][0-9]{2}T[0-9]{2}[:][0-9]{2}[:][0-9]{2}[.][0-9]{3}Z/;
					noMsg = "Shouldn't show up";
					wp = getWhistlepunk();
					stubConsoleMethods();
					consoleWarn = sinon.spy( console, "warn" );
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
				} );

				after( function() {
					logger.reset();
					postal.reset();
					consoleWarn.restore();
					restoreConsoleMethods();
				} );

				it( "should log the message to the console (with ISO8601 in GMT)", function() {
					const count = consoleWarn.callCount;
					const regex = new RegExp( msg );
					let pass = false;

					let arg;
					for ( let i = 0; i < count; i++ ) {
						arg = consoleWarn.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) && timestamp.test( arg ) ) {
							pass = true;
						}
					}

					pass.should.be.ok();
				} );

				it( "should not log any statements above its level", function() {
					const count = consoleWarn.callCount;
					const regex = new RegExp( noMsg );
					let pass = true;

					let arg;
					for ( let i = 0; i < count; i++ ) {
						arg = consoleWarn.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) ) {
							pass = false;
						}
					}

					pass.should.be.ok();
				} );
			} );

			describe( "with custom timestamp", function() {
				let logFactory, logger, consoleWarn, msg, noMsg, wp, timestamp;
				before( function() {
					msg = "Testing stdOut";
					timestamp = /[0-9]{1,2}[:][0-9]{2}[ ](AM|PM)[ ][-][ ][a-zA-Z]{3}[ ][0-9]{1,2}[a-z]{2,3}[,][ ][0-9]{4}[-+][0]{4}/;
					noMsg = "Shouldn't show up";
					wp = getWhistlepunk();
					stubConsoleMethods();
					consoleWarn = sinon.spy( console, "warn" );
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
				} );

				after( function() {
					logger.reset();
					postal.reset();
					restoreConsoleMethods();
					consoleWarn.restore();
				} );

				it( "should log the message to the console (with custom in GMT)", function() {
					const count = consoleWarn.callCount;
					const regex = new RegExp( msg );
					let pass = false;

					let arg;
					for ( let i = 0; i < count; i++ ) {
						arg = consoleWarn.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) && timestamp.test( arg ) ) {
							pass = true;
						}
					}

					pass.should.be.ok();
				} );

				it( "should not log any statements above its level", function() {
					const count = consoleWarn.callCount;
					const regex = new RegExp( noMsg );
					let pass = true;

					let arg;
					for ( let i = 0; i < count; i++ ) {
						arg = consoleWarn.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) ) {
							pass = false;
						}
					}

					pass.should.be.ok();
				} );
			} );

			describe( "with custom timestamp", function() {
				let logFactory, logger, consoleWarn, msg, noMsg, wp, timestamp;
				before( function() {
					msg = "Testing stdOut";
					timestamp = /[0-9]{1,2}[:][0-9]{2}[ ](AM|PM)[ ][-][ ][a-zA-Z]{3}[ ][0-9]{1,2}[a-z]{2,3}[,][ ][0-9]{4}[-+][0-9][1-9][0-9]{2}/;
					noMsg = "Shouldn't show up";
					wp = getWhistlepunk();
					stubConsoleMethods();
					consoleWarn = sinon.spy( console, "warn" );
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
				} );

				after( function() {
					logger.reset();
					postal.reset();
					consoleWarn.restore();
					restoreConsoleMethods();
				} );

				it( "should log the message to the console (with custom in GMT)", function() {
					const count = consoleWarn.callCount;
					const regex = new RegExp( msg );
					let pass = false;

					let arg;
					for ( let i = 0; i < count; i++ ) {
						arg = consoleWarn.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) && timestamp.test( arg ) ) {
							pass = true;
						}
					}

					pass.should.be.ok();
				} );

				it( "should not log any statements above its level", function() {
					const count = consoleWarn.callCount;
					const regex = new RegExp( noMsg );
					let pass = true;

					let arg;
					for ( let i = 0; i < count; i++ ) {
						arg = consoleWarn.getCall( i ).args[ 0 ];
						if ( regex.test( arg ) ) {
							pass = false;
						}
					}

					pass.should.be.ok();
				} );
			} );

			describe( "with multiple topics and loggers", function() {
				let logFactory,
					consoleLog,
					consoleInfo,
					consoleError,
					consoleWarn,
					wp;
				const filter = /(?:\S+\s){2}([a-zA-Z0-9.]+)/;

				before( function() {
					wp = getWhistlepunk();
					stubConsoleMethods();
					consoleLog = sinon.spy( console, "log" );
					consoleInfo = sinon.spy( console, "info" );
					consoleWarn = sinon.spy( console, "warn" );
					consoleError = sinon.spy( console, "error" );
					logFactory = wp( postal, {
						adapters: {
							stdOut: {
								level: 2,
								topic: [ "one.#", "two.#" ]
							}
						}
					} );
					const logger1a = logFactory( "one.a.test" );
					const logger1b = logFactory( "one.b.test" );
					const logger2a = logFactory( "two.a.test" );
					const logger2b = logFactory( "two.b.test" );
					const ignored = logFactory( "three" );

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
				} );

				after( function() {
					postal.reset();
					consoleLog.restore();
					consoleInfo.restore();
					consoleWarn.restore();
					consoleError.restore();
					restoreConsoleMethods();
				} );

				it( "should log the correct number of messages", function() {
					consoleLog.callCount.should.equal( 0 );
				} );

				it( "should info the correct number of messages", function() {
					consoleInfo.callCount.should.equal( 0 );
				} );

				it( "should warn the correct number of messages", function() {
					consoleWarn.callCount.should.equal( 6 );
				} );

				it( "should error the correct number of messages", function() {
					consoleError.callCount.should.equal( 6 );
				} );

				it( "should log the correct messages", function() {
					const warnMessages = _.map( _.range( 0, consoleWarn.callCount ), function( index ) {
						const txt = consoleWarn.getCall( index ).args[ 0 ];
						if ( filter.test( txt ) ) {
							return filter.exec( txt )[ 1 ];
						}
					} );
					const errorMessages = _.map( _.range( 0, consoleError.callCount ), function( index ) {
						const txt = consoleError.getCall( index ).args[ 0 ];
						if ( filter.test( txt ) ) {
							return filter.exec( txt )[ 1 ];
						}
					} );

					let messages = [].concat( warnMessages ).concat( errorMessages );
					messages = _.filter( messages );
					messages.should.eql( [
						"one.a.warn.1",
						"one.b.warn.1",
						"two.a.warn.1",
						"two.b.warn.1",
						"one.a.warn.2",
						"one.b.warn.2",
						"one.a.error.1",
						"one.b.error.1",
						"two.a.error.1",
						"two.b.error.1",
						"one.a.error.2",
						"one.b.error.2"
					] );
				} );
			} );
		} );

		describe( "when debug is enabled", function() {
			let cleanWp, logFactory, logger, consoleLog, noMsg, DEBUG;
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
				const count = consoleLog.callCount;
				const regex = new RegExp( noMsg );
				let pass = true;

				let arg;
				for ( let i = 0; i < count; i++ ) {
					arg = consoleLog.getCall( i ).args[ 0 ];
					if ( regex.test( arg ) ) {
						pass = false;
					}
				}

				pass.should.be.ok();
			} );
		} );
	} );

	describe( "when using the autohost adapter", function() {
		let logFactory, logger, errMsg, infoMsg, wp, fount, host;

		before( function() {
			errMsg = "Testing autohost err";
			infoMsg = "Testing autohost info";
			host = {
				notifyClients: sinon.stub()
			};

			fount = {
				resolve() {
					return Promise.resolve( host );
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
				const args = host.notifyClients.getCall( 0 ).args;
				args[ 0 ].should.equal( "error" );
				args[ 1 ].msg.should.equal( errMsg );

				const args2 = host.notifyClients.getCall( 1 ).args;
				args2[ 0 ].should.equal( "info" );
				args2[ 1 ].msg.should.equal( infoMsg );

				done();
			} );
		} );
	} );

	describe( "when using the debug adapter", function() {
		let logFactory, logger, errMsg, infoMsg, wp, debugFactory, debug, DEBUG;
		before( function() {
			errMsg = "Testing autohost err";
			infoMsg = "Testing autohost info";
			DEBUG = process.env.DEBUG;
			process.env.DEBUG = "debug-test";
			debug = sinon.stub();
			debugFactory = sinon.stub().returns( debug );
			debugFactory[ "@runtimeGlobal" ] = true;
			wp = getWhistlepunk( {
				debug: debugFactory
			} );
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
			logger.reset();
			postal.reset();
			delete debugFactory[ "@runtimeGlobal" ];
			global.proxyquire._disableGlobalCache();
		} );

		it( "should output messages to the debug log", function() {
			debug.callCount.should.equal( 2 );
			debug.getCall( 0 ).args[ 1 ].should.equal( errMsg );
			debug.getCall( 1 ).args[ 1 ].should.equal( infoMsg );
		} );
	} );
} );
