import debug from 'debug';
const debugMetalsmith = debug( 'metalsmith-static-files' );

import fs from 'fs-extra';

/**
 * @typedef Options
 * @property {String} source - Source directory path
 * @property {String} destination - Destination directory path
 */

/** @type {Options} */
const defaults = {};

/**
 * Normalize plugin options
 * @param {Options} [options]
 * @returns {Object}
 */
function normalizeOptions( options ) {
  return Object.assign( {}, defaults, options || {} );
}

/**
 * A Metalsmith plugin to add a directory to the build folder
 *
 * @param {Options} options
 * @returns {import('metalsmith').Plugin}
 */
function plugin( options ) {
  options = normalizeOptions( options );

  // Return early if required options are missing
  if ( !options.source || !options.destination ) {
    const missingOptions = [];
    if ( !options.source ) missingOptions.push( 'source' );
    if ( !options.destination ) missingOptions.push( 'destination' );

    const message = `Skipping metalsmith-static-files: Missing required options: ${ missingOptions.join( ', ' ) }`;
    console.warn( message );
    debugMetalsmith( message );

    return function metalsmithStaticFiles( files, metalsmith, done ) {
      done();
    };
  }

  return function metalsmithStaticFiles( files, metalsmith, done ) {
    debugMetalsmith( 'Running with options: %O', options );
    const source = metalsmith.path( options.source );
    debugMetalsmith( 'source directory: %O', source );
    const destination = metalsmith.path( metalsmith.destination(), options.destination );
    debugMetalsmith( 'destination directory: %O', destination );

    fs.copy( source, destination )
      .then( () => done() )
      .catch( ( err ) => {
        const errorMessage = `An error occurred while copying the directory: ${ err.message }`;
        console.error( errorMessage );
        done( errorMessage );
      } );
  };
}

export default plugin;
