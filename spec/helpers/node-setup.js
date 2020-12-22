"use strict";

/* eslint-disable no-console */

const chai = require( "chai" );
global.proxyquire = require( "proxyquire" ).noPreserveCache();
global.postal = require( "postal" );
chai.use( require( "sinon-chai" ) );
chai.use( require( "dirty-chai" ) );
global.should = chai.should();
global.expect = chai.expect;
global._ = require( "lodash" );
global.sinon = require( "sinon" );

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

const consoleMethods = {
	log: console.log,
	info: console.info,
	warn: console.warn,
	error: console.error
};

global.stubConsoleMethods = function() {
	console.log = function() {};
	console.info = function() {};
	console.warn = function() {};
	console.error = function() {};
};

global.restoreConsoleMethods = function() {
	console.log = consoleMethods.log;
	console.info = consoleMethods.info;
	console.warn = consoleMethods.warn;
	console.error = consoleMethods.error;
};
