"use strict";

const machina = require( "machina" );

const logAdapter = new machina.BehavioralFsm( {

	initialState: "initializing",

	onLog( client, data ) {
		this.handle( client, "onLog", data );
	},

	register( client, init ) {
		init.then( function() {
			this.transition( client, "ready" );
		}.bind( this ) );
	},

	states: {
		initializing: {
			onLog( client ) {
				this.deferUntilTransition( client, "ready" );
			}
		},
		ready: {
			onLog( client, data ) {
				client.onLog( data );
			}
		}
	}

} );

module.exports = logAdapter;
