var ctorFactory = require( "../../src/Logger.js" );

describe( "Logger.js", function() {

	var logger, channelStub, adapterStub;

	beforeEach( function() {
		channelStub = {
			publish: sinon.stub(),
		};
		adapterStub = {
			subscriptions: [
				{
					unsubscribe: sinon.stub()
				}
			]
		};
		logger = new (ctorFactory( channelStub ))( "test", [ adapterStub ] );
	} );

	describe( "when calling reset", function() {
		it( "should unsubscribe all adapters", function() {
			logger.reset();
			adapterStub.subscriptions[ 0 ].unsubscribe.should.be.calledOnce;
		} );
	} );
} );
