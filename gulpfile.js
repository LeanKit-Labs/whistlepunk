var gulp = require( "gulp" );
var mocha = require( "gulp-mocha" );
var istanbul = require( "gulp-istanbul" );
var jshint = require( "gulp-jshint" );
var open = require( "open" ); //jshint ignore:line
var allSrcFiles = "./src/**/*.js";
var allTestFiles = "./spec/**/*.spec.js";
var testSetup = "./spec/helpers/node-setup.js";
var gulpMocha = require( "gulp-spawn-mocha" );

function runMocha( singleRun, files ) {
	return gulp.src( files, { read: false } )
		.pipe( gulpMocha( {
			R: "spec",
			"r": [ testSetup ]
		} ) ).on( "error", function() {
		if ( singleRun ) {
			process.exit( 1 );
		}
	} );
}

gulp.task( "test", function() {
	return runMocha( true, allTestFiles );
} );

gulp.task( "watch", [ "test" ], function() {
	gulp.watch( [ allTestFiles, "./src/**" ], [ "test" ] );
} );

gulp.task( "coverage", function( cb ) {
	gulp.src( [ allSrcFiles ] )
		.pipe( istanbul() )
		.pipe( istanbul.hookRequire() )
		.on( "finish", function() {
			gulp.src( [ testSetup, allTestFiles ] )
				.pipe( mocha() )
				.pipe( istanbul.writeReports() )
				.on( "end", function() {
					process.exit();
				} );
		} );
} );

gulp.task( "lint", function() {
	return gulp.src( [ allSrcFiles, allTestFiles ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( "jshint-stylish" ) );
} );
