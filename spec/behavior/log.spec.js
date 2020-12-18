require( "../helpers/node-setup" );
var logFn = require( "../../src/index" ).log;
var mockAdapter = require( "../adapters/mockAdapter" )();

describe( "Alternate API", function() {
	describe( "before initialization", function() {
		let log;
		before( function() {
			log = logFn( "test" );
		} );

		it( "should not throw exceptions", function() {
			should.not.throw( function() {
				
				log.debug( "one" );
			} );
			should.not.throw( function() {
				log.info( "two" );
			} );
			should.not.throw( function() {
				log.warn( "three" );
			} );
			should.not.throw( function() {
				log.error( "four" );
			} );
		} );
	} );

	describe( "with debug env set", function() {
		const original = process.env.DEBUG;
		let log;
		before( function() {
			process.env.DEBUG = "test";
			log = logFn( {
				adapters: {
					"./spec/mockLogger.js": {
						level: 5
					}
				}
			}, "test" );
			log.debug( "hello" );
			log.info( "ignored" );
			log.warn( "ignored" );
			log.error( "ignored" );
		} );

		it( "should not send log entries to other adapters", function() {
			expect( mockAdapter.test ).to.be.undefined;
		} );

		after( function() {
			process.env.DEBUG = original;
		} );
	} );

	describe( "without debug", function() {
		const original = process.env.DEBUG;
		let log;
		before( function() {
			delete process.env.DEBUG;
			log = logFn( {
				adapters: {
					"./spec/adapters/mockAdapter.js": {
						level: 2
					}
				}
			}, "test" );

			log.debug( "debug" );
			log.info( "info" );
			log.warn( "warn" );
			log.error( "error" );
		} );

		it( "should log entries to adapter", function() {
			mockAdapter.test.entries.should.eql( {
				error: [ "error" ],
				warn: [ "warn" ],
				info: [],
				debug: []
			} );
		} );

		after( function() {
			process.env.DEBUG = original;
		} );
	} );
} );
