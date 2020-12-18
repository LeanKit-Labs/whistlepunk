"use strict";

let adapter;

function configure( _ ) {
	adapter = adapter || {

		init( ) {
			return new Promise( function( resolve ) {
				setTimeout( function() {
					resolve();
				}, 200 );
			} );
		},

		onLog( data ) {
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
