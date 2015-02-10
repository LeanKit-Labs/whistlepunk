var gulp = require( "gulp" );
var mocha = require( "gulp-mocha" );
var istanbul = require( "gulp-istanbul" );
var jshint = require( "gulp-jshint" );
var open = require( "open" ); //jshint ignore:line
var testFiles = "./spec/**/*.spec.js";

function cover( done ) {
	gulp.src( [ "./src/**/*.js" ] )
		.pipe( istanbul() )
		.pipe( istanbul.hookRequire() )
		.on( "finish", function() {
			done( runSpecs() );
		} );
}

function runSpecs() { // jshint ignore : line
	return gulp.src( [ testFiles ], { read: false } )
		.pipe( mocha( { reporter: "spec" } ) );
}

function writeReport( cb, openBrowser, tests ) {
	tests
		.on( "error", function( e ) {
			console.log( "Test Error" );
			if ( e.stack ) {
				console.log( e.stack );
			}
			cb();
		} )
		.pipe( istanbul.writeReports() )
		.on( "end", function() {
			if ( openBrowser ) {
				open( "./coverage/lcov-report/index.html" );
			}
			cb();
		} );
}

gulp.task( "continuous-coverage", function( cb ) {
	cover( writeReport.bind( undefined, cb, false ) );
} );

gulp.task( "continuous-test", function() {
	return runSpecs()
		.on( "end", function() {
			console.log( process._getActiveRequests() );
			console.log( process._getActiveHandles() );
		} );
} );

gulp.task( "test", function() {
	return runSpecs()
		.on( "end", process.exit.bind( process, 0 ) )
		.on( "error", process.exit.bind( process, 1 ) );
} );

gulp.task( "coverage", function( cb ) {
	cover( writeReport.bind( undefined, cb, true ) );
} );

gulp.task( "coverage-watch", function() {
	gulp.watch( [ "./src/**/*", "./spec/**/*" ], [ "continuous-coverage" ] );
} );

gulp.task( "test-watch", function() {
	gulp.watch( [ "./src/**/*", "./spec/**/*" ], [ "continuous-test" ] );
} );

gulp.task( "default", [ "continuous-coverage", "coverage-watch" ], function() {} );

gulp.task( "specs", [ "continuous-test", "test-watch" ], function() {} );

gulp.task( "lint", function() {
	return gulp.src( [ "./src/**/*.js", "./spec/**/*.js" ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( "jshint-stylish" ) );
} );