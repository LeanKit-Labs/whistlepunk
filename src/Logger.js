var util = require( "util" );
var _ = require( "lodash" );
var moment = require( "moment" );
module.exports = function( channel, resolve ) {
	var logLevels = [ "off", "error", "warn", "info", "debug" ];

	function Logger( ns, adapters ) {
		this.namespace = ns || "";
		this.adapters = adapters;
	}

	Logger.prototype.logIt = function logIt( type, data ) {
		var msg = ( typeof data[ 0 ] === "string" ) ? util.format.apply( null, data ) : data;
		var utc = moment.utc();
		var payload = {
			msg: msg,
			timestamp: utc.toISOString(),
			utc: utc,
			type: type,
			level: logLevels.indexOf( type ),
			namespace: this.namespace
		};
		channel.publish( this.namespace, payload );
	};

	Logger.prototype.reset = function reset() {
		_.each( this.adapters, function( adapter ) {
			_.each( adapter.subscriptions, function( subscription ) {
				var topic = subscription.topic || "#";
				if ( resolve( topic, this.namespace ) ) {
					subscription.unsubscribe();
				}
			}.bind( this ) );
		}.bind( this ) );
	};

	logLevels.slice( 1 ).forEach( function( level ) {
		Logger.prototype[ level ] = function() {
			this.logIt( level, Array.prototype.slice.call( arguments, 0 ) );
		};
	} );

	return Logger;
};
