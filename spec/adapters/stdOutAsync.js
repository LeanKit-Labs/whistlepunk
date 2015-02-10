var colors = require( "colors" );
var moment = require( "moment" );
var _ = require( "lodash" );
var when = require( "when" );
var postal = require( "postal" );
var adapter;

function configure( config ) {
	var envDebug = !!process.env.DEBUG;

	var theme = _.extend( {
		info: "green",
		warn: "yellow",
		debug: "blue",
		error: "red"
	}, config.theme );

	colors.setTheme( theme );

	adapter = adapter || {

		init: function( config ) {
			return when.promise( function( resolve, reject ) {
				setTimeout( function() {
					resolve();
				}, 1000 );
			} );
		},

		onLog: function( data ) {
			postal.publish( {
				channel: "wp-test",
				topic: "stdOutAsync",
				data: data.msg
			} );
		},

		constraint: function( data ) {
			return data.level <= config.level && ( !config.bailIfDebug || ( config.bailIfDebug && !envDebug ) );
		}
	};
}

module.exports = function( config ) {
	configure( config );
	return adapter;
};