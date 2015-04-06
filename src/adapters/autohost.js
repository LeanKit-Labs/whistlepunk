var noOpAdapter = { onLog: function() {} };
var adapter;

function createAhAdapter( fount ) {
	var host;

	return {
		init: function() {
			return fount.resolve( "ah" )
				.then( function( _host ) {
					host = _host;
				} );
		},
		onLog: function( data ) {
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
