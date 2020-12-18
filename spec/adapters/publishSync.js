"use strict";

const colors = require( "colors" );
const _ = require( "lodash" );
const postal = require( "postal" );
let adapter;

function configure( config ) {
	const envDebug = !!process.env.DEBUG;

	const theme = _.extend( {
		info: "green",
		warn: "yellow",
		debug: "blue",
		error: "red"
	}, config.theme );

	colors.setTheme( theme );

	adapter = adapter || {
		onLog( data ) {
			let msg;

			postal.publish( {
				channel: "wp-test",
				topic: "publishSync",
				data: data.msg
			} );
		},
		constraint( data ) {
			return data.level <= config.level && ( !config.bailIfDebug || ( config.bailIfDebug && !envDebug ) );
		}
	};
}

module.exports = function( config ) {
	configure( config );
	return adapter;
};
