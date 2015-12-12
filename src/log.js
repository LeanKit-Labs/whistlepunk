var _ = require( "lodash" );
var postal = require( "postal" );
var logger;
var logFn;
var logs = {};
var topics = [];

function configure( config ) {
	var envDebug = !!process.env.DEBUG;
	if ( envDebug ) {
		logger = logFn( postal, { adapters: { debug: { level: 5 } } } );
	} else {
		logger = logFn( postal, config );
	}
	_.each( logs, function( log ) {
		log.reset();
	} );
	logs = {};
	var topicList = topics.slice( 0 );
	topics = [];
	_.each( topicList, createLog );
}

function createLog( topic ) {
	if ( !_.contains( topics, topic ) && !logs[ topic ] ) {
		var log = logger( topic );
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
	var log = logs[ topic ];
	var fns = _.functions( log );
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
