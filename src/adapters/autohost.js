"use strict";

const noOpAdapter = { onLog() {} };
let adapter;

function createAhAdapter( fount ) {
	let host;

	return {
		init() {
			return fount.resolve( "ah" )
				.then( function( _host ) {
					host = _host;
				} );
		},
		onLog( data ) {
			if ( host && host.notifyClients ) {
				host.notifyClients( data.type, data );
			}
		}
	};
}

module.exports = function( config, formatter, fount ) {
	adapter = adapter || ( fount ? createAhAdapter( fount ) : noOpAdapter );
	return adapter;
};
