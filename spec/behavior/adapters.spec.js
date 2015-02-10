var should = require( "should" );
var sinon = require( "sinon" );
var when = require( "when" );
var postal = require( "postal" );
var index = "../../src/index.js";
var configParser = "../../src/configParser.js";
var stdOut = "../../src/adapters/stdOut.js";

function getWp() {
	delete require.cache[ require.resolve( index ) ];
	delete require.cache[ require.resolve( configParser ) ];
	delete require.cache[ require.resolve( stdOut ) ];
	return require( index );
}

describe( "Built-in Adapters", function() {

	describe( "when using the stdOut adapter", function() {

		describe( "when debug is not enabled", function() {

			var logFactory;
			var logger;
			var consoleLog;
			var msg = "Testing stdOut";
			var noMsg = "Shouldn't show up";
			var wp;
			before( function() {
				wp = getWp();
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
			} );

			after( function() {
				logger.reset();
				consoleLog.restore();
			} );

			it( "should log the message to the console", function() {
				var count = consoleLog.callCount;
				var regex = new RegExp( msg );
				var pass = false;

				var arg;
				for (var i = 0; i < count; i++) {
					arg = consoleLog.getCall( i ).args[ 0 ];
					if ( regex.test( arg ) ) {
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

		describe( "when debug is enabled", function() {
			var cleanWp;
			var logFactory;
			var logger;
			var consoleLog;
			var noMsg = "Shouldn't show up";
			var DEBUG;
			before( function() {
				DEBUG = process.env.DEBUG;
				process.env.DEBUG = true;
				cleanWp = getWp();

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
		var logFactory;
		var logger;
		var errMsg = "Testing autohost err";
		var infoMsg = "Testing autohost info";
		var wp;
		var fount;
		var host;
		before( function() {
			host = {
				notifyClients: sinon.stub()
			};

			fount = {
				resolve: function( name ) {
					return when( host );
				}
			};
			wp = getWp();
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
		var logFactory;
		var logger;
		var errMsg = "Testing autohost err";
		var infoMsg = "Testing autohost info";
		var wp;
		var req;
		var messages = [];
		var debug;
		var DEBUG;
		before( function() {
			DEBUG = process.env.DEBUG;
			process.env.DEBUG = "debug-test";
			debug = require( "debug" );
			debug.log = sinon.stub( debug, "log" );
			wp = getWp();
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
		} );

		it( "should output messages to the debug log", function() {
			debug.log.callCount.should.equal( 2 );

			debug.log.getCall( 0 ).args[ 1 ].should.equal( errMsg );
			debug.log.getCall( 1 ).args[ 1 ].should.equal( infoMsg );
		} );

	} );

} );