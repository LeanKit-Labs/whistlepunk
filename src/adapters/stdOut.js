"use strict";

const colors = require( "colors" );
const _ = require( "lodash" );
let adapter, lastConfig;

function configure( config, formatter ) {
	if ( adapter && lastConfig && _.eq( lastConfig, config ) ) {
		return;
	}
	lastConfig = config;
	const envDebug = !!process.env.DEBUG;

	const theme = _.extend( {
		info: "green",
		warn: "yellow",
		debug: "blue",
		error: "red"
	}, config.theme );

	const logType = {
		info: "info",
		warn: "warn",
		debug: "log",
		error: "error"
	};

	colors.setTheme( theme );

	adapter = {
		onLog( data ) {
			let msg;
			if ( data.msg.toString() === "[object Object]" ) {
				msg = config.formatJSON ? JSON.stringify( data.msg, null, 2 ) : JSON.stringify( data.msg );
			} else {
				msg = data.msg;
			}
			const timestamp = formatter( config, data );
			/* eslint-disable-next-line no-console */
			console[ logType[ data.type ] ]( colors[ data.type ]( timestamp, `[${ data.namespace }]` || "", msg ) );
		},
		constraint( data ) {
			return data.level <= config.level && ( !config.bailIfDebug || ( config.bailIfDebug && !envDebug ) );
		}
	};
}

module.exports = function( config, formatter ) {
	configure( config, formatter );
	return adapter;
};
