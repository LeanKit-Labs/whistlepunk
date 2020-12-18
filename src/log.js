"use strict";

const _ = require( "lodash" );
const postal = require( "postal" );
let logger,	logFn;
let logs = {};
let topics = [];

function configure( config ) {
	const envDebug = !!process.env.DEBUG;
	if ( envDebug ) {
		logger = logFn( postal, { adapters: { debug: { level: 5 } } } );
	} else {
		logger = logFn( postal, config );
	}
	_.each( logs, function( log ) {
		log.reset();
	} );
	logs = {};
	const topicList = topics.slice( 0 );
	topics = [];
	_.each( topicList, createLog );
}

function createLog( topic ) {
	if ( !_.includes( topics, topic ) && !logs[ topic ] ) {
		const log = logger( topic );
		topics.push( topic );
		logs[ topic ] = log;
	}
	return wrap( topic );
}

function init( config, ns ) {
	if ( typeof config === "string" ) {
		ns = config;
	} else {
		configure( config );
	}
	return ns ? createLog( ns ) : createLog;
}

function wrap( topic ) {
	const log = logs[ topic ];
	const fns = _.functionsIn( log );
	return _.reduce( fns, function( wrapper, fn ) {
		wrapper[ fn ] = log[ fn ].bind( log );
		return wrapper;
	}, {} );
}

module.exports = function( setup ) {
	logFn = setup;
	logger = logFn( postal, {} );
	return init;
};
