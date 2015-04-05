var colors = require( "colors" );
var _ = require( "lodash" );
var adapter;

function configure( config, formatter ) {
	var envDebug = !!process.env.DEBUG;

	var theme = _.extend( {
		info: "green",
		warn: "yellow",
		debug: "blue",
		error: "red"
	}, config.theme );

	colors.setTheme( theme );

	adapter = adapter || {
		onLog: function( data ) {
			var msg;
			if ( data.msg.toString() === "[object Object]" ) {
				msg = config.formatJSON ? JSON.stringify( data.msg, null, 2 ) : JSON.stringify( data.msg );
			} else {
				msg = data.msg;
			}
			var timestamp = formatter( config, data );
			console.log( colors[ data.type ]( timestamp, data.namespace || "", msg ) );
		},
		constraint: function( data ) {
			return data.level <= config.level && ( !config.bailIfDebug || ( config.bailIfDebug && !envDebug ) );
		}
	};
}

module.exports = function( config, formatter ) {
	configure( config, formatter );
	return adapter;
};
