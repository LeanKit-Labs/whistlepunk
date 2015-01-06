var _ = require( "lodash" );
var fs = require( "fs" );
var path = require( "path" );
module.exports = function( channel, config ) {

	_.each( config.adapters, function( adapterCfg, name ) {
		var adapterPath = path.join( __dirname, "./adapters", name + ".js" );
		console.log( adapterPath );
		var adapter = require( adapterPath )( channel, adapterCfg );
	} );

}
