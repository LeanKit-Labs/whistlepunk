"use strict";

const _ = require( "lodash" );
const fs = require( "fs" );
const path = require( "path" );

const builtIn = getAdapters();

function defaultConstraint( config ) {
	return function levelConstraint( data ) {
		return data.level <= config.level;
	};
}

function getAdapters() {
	const adapterPath = path.resolve( __dirname, "./adapters" );
	const files = fs.readdirSync( adapterPath );
	return _.reduce( files, function( acc, file ) {
		acc[ file.split( "." )[ 0 ] ] = path.join( adapterPath, file );
		return acc;
	}, {} );
}

function timeFormatter( config, data ) {
	const time = config.timestamp;
	if ( time ) {
		if ( time.local ) {
			data.utc.local();
		}
		return data.utc.format( time.format || "YYYY-MM-DDTHH:mm:ss.SSSZ" );
	}
	return data.timestamp;

	// return config.timeformat ? data.raw.format( config.format ) : data.timestamp;
}

function wireUp( adapterFsm, config, channel, adapter ) {
	let init,
		topics;
	let handler = adapter.onLog;

	if ( _.isFunction( adapter.init ) ) {
		init = adapter.init();

		if ( init && init.then ) {
			adapterFsm.register( adapter, init );
			handler = adapterFsm.onLog.bind( adapterFsm, adapter );
		}
	}

	if ( config.topic && _.isArray( config.topic ) ) {
		topics = config.topic;
	} else {
		topics = ( config.topic || "#" ).split( "," );
	}
	const subscriptions = _.map( topics, function( topic ) {
		return channel
			.subscribe( topic, handler )
			.constraint( adapter.constraint || defaultConstraint( config ) );
	} );
	if ( adapter.subscriptions ) {
		_.each( adapter.subscriptions, function( subscription ) {
			subscription.unsubscribe();
		} );
	}
	adapter.subscriptions = subscriptions;
}

module.exports = function( channel, config, fount ) {
	const adapterFsm = require( "./adapter.fsm" );

	return _.map( config.adapters, function( adapterCfg, name ) {
		let adapterPath;
		if ( /[/]/.test( name ) ) {
			adapterPath = require.resolve( path.resolve( process.cwd(), name ) );
		} else {
			adapterPath = builtIn[ name ] || require.resolve( name );
		}
		const adapter = require( adapterPath )( adapterCfg, timeFormatter, fount );

		wireUp( adapterFsm, adapterCfg, channel, adapter );

		return adapter;
	} );
};
