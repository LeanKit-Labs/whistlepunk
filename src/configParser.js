var _ = require( "lodash" );
var fs = require( "fs" );
var path = require( "path" );
module.exports = function( channel, config, fount ) {

	_.each( config.adapters, function( adapterCfg, name ) {
		var adapterPath = path.join( __dirname, "./adapters", name + ".js" );
		var adapter = require( adapterPath )( channel, adapterCfg, fount );
	} );

}
