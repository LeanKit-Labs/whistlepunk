var machina = require( "machina" );

var logAdapter = new machina.BehavioralFsm( {

	initialState: "initializing",

	onLog: function( client, data ) {
		this.handle( client, "onLog", data );
	},

	register: function( client, init ) {
		init.then( function() {
			this.transition( client, "ready" );
		}.bind( this ) );
	},

	states: {
		initializing: {
			onLog: function( client ) {
				this.deferUntilTransition( client, "ready" );
			}
		},
		ready: {
			onLog: function( client, data ) {
				client.onLog( data );
			}
		}
	}

} );

module.exports = logAdapter;