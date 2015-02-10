var should = require( "should" );
var postal = require( "postal" );
var path = require( "path" );
var wp = require( "../../src/index.js" );
var adapterPath = path.resolve( __dirname + "/../adapters" );
var stdOutAsync = adapterPath + "/stdOutAsync.js";
var stdOutSync = adapterPath + "/stdOutSync.js";
var config = {
	"adapters": {}
};

config.adapters[ stdOutSync ] = {
	"level": 5,
	"bailIfDebug": true
};

config.adapters[ stdOutAsync ] = {
	"level": 5,
	"bailIfDebug": true
};

describe( "Whistlepunk Synchronous Initialization", function() {

	describe( "when initializing whistlepunk", function() {
		var Logger;
		var log;
		var syncLogReceived;
		var asyncLogReceived;
		var msg = "You been whistlepunk'd";

		before( function() {
			postal.subscribe( {
				channel: "wp-test",
				topic: "stdOutSync",
				callback: function( data ) {
					syncLogReceived = data;
				}
			} );

			postal.subscribe( {
				channel: "wp-test",
				topic: "stdOutAsync",
				callback: function( data ) {
					asyncLogReceived = data;
				}
			} );

			Logger = wp( postal, config );
			log = Logger( "wp-tests" );
			log.info( msg );
		} );

		it( "should be immediately available", function() {
			syncLogReceived.should.equal( msg );
		} );

		it( "should queue logs for async adapters", function( done ) {
			this.timeout( 3000 );

			should( asyncLogReceived ).not.be.ok;

			setTimeout( function() {
				asyncLogReceived.should.equal( msg );
				done();
			}, 2000 );
		} );

	} );

} );