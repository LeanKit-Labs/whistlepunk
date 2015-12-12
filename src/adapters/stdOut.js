var colors = require( "colors" );
var _ = require( "lodash" );
var adapter, lastConfig;

function configure( config, formatter ) {
	if( adapter && lastConfig && _.eq( lastConfig, config ) ) {
		return;
	}
	lastConfig = config;
	var envDebug = !!process.env.DEBUG;

	var theme = _.extend( {
		info: "green",
		warn: "yellow",
		debug: "blue",
		error: "red"
	}, config.theme );

	var logType = {
		info: "info",
		warn: "warn",
		debug: "log",
		error: "error"
	};

	colors.setTheme( theme );

	adapter = {
		onLog: function( data ) {
			var msg;
			if ( data.msg.toString() === "[object Object]" ) {
				msg = config.formatJSON ? JSON.stringify( data.msg, null, 2 ) : JSON.stringify( data.msg );
			} else {
				msg = data.msg;
			}
			var timestamp = formatter( config, data );
			console[logType[data.type]]( colors[ data.type ]( timestamp, "[" + data.namespace + "]" || "", msg ) );
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
