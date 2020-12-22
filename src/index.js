"use strict";

function setup( postal, config, fount ) {
	config = config || {};
	const log = postal.channel( config.logChannel || "log" );
	const resolver = postal.configuration.resolver.compare.bind( postal.configuration.resolver );
	const Logger = require( "./Logger.js" )( log, resolver );
	const adapters = require( "./configParser" )( log, config, fount );

	function loggerFactory( namespace ) {
		return new Logger( namespace, adapters );
	}

	return loggerFactory;
}

setup.log = require( "./log" )( setup );
module.exports = setup;
