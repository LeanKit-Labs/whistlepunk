var colors = require( "colors" );
var moment = require( "moment" );
var _ = require( "lodash" );
module.exports = function( logChannel, config ) {

	var envDebug = !!process.env.DEBUG;

	var theme = _.extend( {
		info: "green",
		warn: "yellow",
		debug: "blue",
		error: "red"
	}, config.theme );

	colors.setTheme( theme );

	logChannel.subscribe( "#", function( data ) {
		var msg = data.msg.toString() === "[object Object]" ? JSON.stringify( data.msg, null, 2 ) : data.msg;
		console.log( colors[ data.type ]( moment( data.timestamp ).format(), data.msg ) );
	} ).constraint( function( data ) {
		return data.level <= config.level && ( !config.bailIfDebug || ( config.bailIfDebug && !envDebug ) );
	} );
};
