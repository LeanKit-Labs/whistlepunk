"use strict";

const debug = require( "debug" );
const namespaces = {};
const debugAdapter = {
	onLog( data ) {
		let debugNs = namespaces[ data.namespace ];
		if ( !debugNs ) {
			debugNs = namespaces[ data.namespace ] = debug( data.namespace );
		}
		debugNs( data.type, data.msg );
	}
};

module.exports = function( _config ) {
	return debugAdapter;
};
