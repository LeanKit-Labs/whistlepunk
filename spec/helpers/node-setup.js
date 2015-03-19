var chai = require( "chai" );
global.postal = require( "postal" );
global.when = require( "when" );
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );
global.should = chai.should();
global._ = require( "lodash" );
global.sinon = require( "sinon" );
require( "sinon-as-promised" )( global.when.Promise );

