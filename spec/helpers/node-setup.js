var chai = require( "chai" );
global.proxyquire = require( "proxyquire" ).noPreserveCache();
global.postal = require( "postal" );
global.when = require( "when" );
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );
global.should = chai.should();
global._ = require( "lodash" );
global.sinon = require( "sinon" );
require( "sinon-as-promised" )( global.when.Promise );

function nukeTheSource() {
	_.each( require.cache, function( val, path ) {
		if ( /\/src\//.test( path ) ) {
			delete require.cache[ path ];
		}
	} );
}

global.getWhistlepunk = function( stubs ) {
	stubs = stubs || {};
	nukeTheSource();
	return global.proxyquire( "../../src/index.js", stubs );
};

var consoleMethods = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
};

global.stubConsoleMethods = function(){
  console.log = function(){};
  console.info = function(){};
  console.warn = function(){};
  console.error = function(){};
};

global.restoreConsoleMethods = function(){
  console.log = consoleMethods.log;
  console.info = consoleMethods.info;
  console.warn = consoleMethods.warn;
  console.error = consoleMethods.error;
};
