var noOpAdapter = { onLog: function() {} };
var adapter;

function createAhAdapter( fount ) {
	return fount
		.resolve( "ah" )
		.then( function( host ) {
			return {
				onLog: function( data ) {
					if ( host && host.notifyClients ) {
						host.notifyClients( data.type, data );
					}
				}
			};
		} );
}

module.exports = function( config, fount ) {
	adapter = adapter || ( fount ? createAhAdapter( fount ) : noOpAdapter );
	return adapter;
};
