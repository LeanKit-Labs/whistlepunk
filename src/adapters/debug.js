var debug = require( "debug" );
var namespaces = {};
var debugAdapter = {
	onLog: function( data ) {
		var debugNs = namespaces[ data.namespace ];
		if ( !debugNs ) {
			debugNs = namespaces[ data.namespace ] = debug( data.namespace );
		}
		debugNs( data.type, data.msg );
	}
};

module.exports = function( config ) {
	return debugAdapter;
};