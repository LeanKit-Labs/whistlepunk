var util = require( "util" );
module.exports = function( channel ) {
	var logLevels = [ "off", "error", "warn", "info", "debug" ];

	function Logger( ns ) {
		this.namespace = ns || "whistlepunk";
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

	logLevels.slice( 1 ).forEach( function( level ) {
		Logger.prototype[ level ] = function() {
			this.logIt( level, Array.prototype.slice.call( arguments, 0 ) );
		};
	} );

	return Logger;
};
