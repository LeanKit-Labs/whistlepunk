var ctorFactory = require( "../../src/Logger.js" );

describe( "Logger.js", function() {

	var logger, channelStub, adapterStub;

	beforeEach( function() {
		channelStub = {
			publish: sinon.stub(),
		};
		adapterStub = {
			subscription: {
				unsubscribe: sinon.stub()
			}
		};
		logger = new (ctorFactory( channelStub ))( "test", [ adapterStub ] );
	} );

	describe( "when calling logIt", function() {
		it( "should use a default timestamp if not provided", function() {
			logger.logIt( "info", [ "Please, I'll use your datetime..." ] );
			channelStub.publish.firstCall.args[ 1 ].timestamp.should.be.a( "Date" );
		} );
		it( "should use a passed timestamp if provided", function() {
			var myTimestamp = new Date();
			logger.logIt( "info", [ "Please, use my datetime..." ], myTimestamp );
			channelStub.publish.firstCall.args[ 1 ].timestamp.should.be.a( "Date" );
			channelStub.publish.firstCall.args[ 1 ].timestamp.should.equal( myTimestamp );
		} );
	} );

	describe( "when calling reset", function() {
		it( "should unsubscribe all adapters", function() {
			logger.reset();
			adapterStub.subscription.unsubscribe.should.be.calledOnce;
		} );
	} );
} );
