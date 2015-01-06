var debug = require( "debug" );
var _ = require( "lodash" );
module.exports = function( logChannel, config ) {
	var namespaces = {};
	logChannel.subscribe( "#", function( data ) {
		var debugNs = namespaces[ data.namespace ]
		if ( !debugNs ) {
			debugNs = namespaces[ data.namespace ] = debug( data.namespace );
		}
		debugNs( data.type, data.msg );
	} ).constraint( function( data ) {
		return data.level <= config.level;
	} );
};
