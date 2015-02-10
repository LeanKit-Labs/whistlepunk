var util = require( "util" );
var _ = require( "lodash" );
module.exports = function( channel ) {
	var logLevels = [ "off", "error", "warn", "info", "debug" ];

	function Logger( ns, adapters ) {
		this.namespace = ns || "whistlepunk";
		this.adapters = adapters;
	}

	Logger.prototype.logIt = function logIt( type, data ) {
		var msg = ( typeof data[ 0 ] === "string" ) ? util.format.apply( null, data ) : data;
		var payload = {
			msg: msg,
			timestamp: Date.now(),
			type: type,
			level: logLevels.indexOf( type ),
			namespace: this.namespace
		};
		channel.publish( type, payload );
	};

	Logger.prototype.reset = function reset() {

		_.each( this.adapters, function( adapter ) {
			adapter.subscription.unsubscribe();
		} );

	};

	logLevels.slice( 1 ).forEach( function( level ) {
		Logger.prototype[ level ] = function() {
			this.logIt( level, Array.prototype.slice.call( arguments, 0 ) );
		};
	} );

	return Logger;
};