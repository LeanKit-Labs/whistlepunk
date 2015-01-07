module.exports = function( logChannel, config, fount ) {
	if ( fount ) {
		fount
			.resolve( "ah" )
			.then( function( host ) {
				logChannel.subscribe( "#", function( data ) {
					if ( host && host.notifyClients ) {
						host.notifyClients( data.type, data );
					}
				} ).constraint( function( data ) {
					return data.level <= config.level;
				} );
			} );
	}
};
