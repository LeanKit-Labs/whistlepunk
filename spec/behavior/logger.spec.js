const ctorFactory = require( "../../src/Logger.js" );

describe( "Logger.js", function() {
	let logger, channelStub, adapterStub;

	beforeEach( function() {
		channelStub = {
			publish: sinon.stub()
		};
		adapterStub = {
			subscriptions: [
				{
					unsubscribe: sinon.stub()
				}
			]
		};
		logger = new( ctorFactory( channelStub, function() {
			return true;
		} ) )( "test", [ adapterStub ] );
	} );

	describe( "when calling reset", function() {
		it( "should unsubscribe all adapters", function() {
			logger.reset();
			adapterStub.subscriptions[ 0 ].unsubscribe.should.be.calledOnce();
		} );
	} );
} );
