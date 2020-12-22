"use strict";

const util = require( "util" );
const _ = require( "lodash" );
const moment = require( "moment" );
module.exports = function( channel, resolve ) {
	const logLevels = [ "off", "error", "warn", "info", "debug" ];

	function Logger( ns, adapters ) {
		this.namespace = ns || "";
		this.adapters = adapters;
	}

	Logger.prototype.logIt = function logIt( type, data ) {
		const msg = ( typeof data[ 0 ] === "string" ) ? util.format.apply( null, data ) : data;
		const utc = moment.utc();
		const payload = {
			msg,
			timestamp: utc.toISOString(),
			utc,
			type,
			level: logLevels.indexOf( type ),
			namespace: this.namespace
		};
		channel.publish( this.namespace, payload );
	};

	Logger.prototype.reset = function reset() {
		_.each( this.adapters, function( adapter ) {
			_.each( adapter.subscriptions, function( subscription ) {
				const topic = subscription.topic || "#";
				if ( resolve( topic, this.namespace ) ) {
					subscription.unsubscribe();
				}
			}.bind( this ) );
		}.bind( this ) );
	};

	logLevels.slice( 1 ).forEach( function( level ) {
		Logger.prototype[ level ] = function( ...args ) {
			this.logIt( level, args );
		};
	} );

	return Logger;
};
