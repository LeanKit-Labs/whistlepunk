var colors = require( "colors" );
var moment = require( "moment" );
var _ = require( "lodash" );
var when = require( "when" );
var postal = require( "postal" );
var adapter;

function configure( config ) {

	adapter = adapter || {

		init: function( config ) {
			return when.promise( function( resolve, reject ) {
				setTimeout( function() {
					resolve();
				}, 200 );
			} );
		},

		onLog: function( data ) {
			postal.publish( {
				channel: "wp-test",
				topic: "publishAsync",
				data: data.msg
			} );
		}
	};
}

module.exports = function( config ) {
	configure( config );
	return adapter;
};