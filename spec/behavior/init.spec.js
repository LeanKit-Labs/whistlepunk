var path = require( "path" );
var wp = require( "../../src/index.js" );
var adapterPath = path.resolve( __dirname + "/../adapters" );
var publishAsync = adapterPath + "/publishAsync.js";
var publishSync = adapterPath + "/publishSync.js";
var config = {
	"adapters": {}
};

config.adapters[ publishSync ] = {
	"level": 5
};

config.adapters[ publishAsync ] = {
	"level": 5
};

describe( "Whistlepunk Synchronous Initialization", function() {

	describe( "when initializing whistlepunk", function() {
		var logFactory, log, syncLogReceived, asyncLogReceived, msg;

		before( function() {
			msg = "You been whistlepunk'd";
			postal.subscribe( {
				channel: "wp-test",
				topic: "publishSync",
				callback: function( data ) {
					syncLogReceived = data;
				}
			} );

			postal.subscribe( {
				channel: "wp-test",
				topic: "publishAsync",
				callback: function( data ) {
					asyncLogReceived = data;
				}
			} );

			logFactory = wp( postal, config );
			log = logFactory( "wp-tests" );
			log.info( msg );
		} );

		after( function() {
			postal.reset();
		} );

		it( "should be immediately available", function() {
			syncLogReceived.should.equal( msg );
		} );

		it( "should queue logs for async adapters", function( done ) {
			this.timeout( 1000 );

			( typeof asyncLogReceived ).should.equal( "undefined" );

			setTimeout( function() {
				asyncLogReceived.should.equal( msg );
				done();
			}, 500 );
		} );
	} );
} );
