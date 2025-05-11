// Import declarations at the top with a consistent order
import fs from 'fs-extra';

// Plugin namespace for debugging
const debugNs = 'metalsmith-static-files';

/**
 * @typedef {Object} Options
 * @property {string} source - Source directory path relative to metalsmith root
 * @property {string} destination - Destination directory path relative to build directory
 * @property {boolean} [overwrite=true] - Whether to overwrite existing files
 * @property {boolean} [preserveTimestamps=false] - Whether to preserve timestamps when copying
 * @property {string[]} [filter] - Optional array of glob patterns to include/exclude files
 */

/**
 * Default plugin options
 * @type {Options}
 */
const defaults = {
  source: 'src/assets',
  destination: 'assets',
  overwrite: true,
  preserveTimestamps: false
};

/**
 * Normalize plugin options by merging with defaults
 *
 * @private This function is primarily for internal use and testing
 * @param {Options} [options] - User provided options
 * @returns {Options} - Normalized options with defaults applied
 */
function normalizeOptions( options ) {
  return { ...defaults, ...( options || {} ) };
}

/**
 * A Metalsmith plugin to copy static files from a source directory to the build directory.
 * This plugin is useful for including assets that don't require processing,
 * such as images, fonts, or other static resources.
 *
 * @param {Options} options - Plugin configuration options
 * @returns {import('metalsmith').Plugin} - Metalsmith plugin function
 * @example
 * // Basic usage
 * metalsmith.use(staticFiles({
 *   source: 'assets',
 *   destination: 'assets'
 * }));
 *
 * @example
 * // With additional options
 * metalsmith.use(staticFiles({
 *   source: 'static',
 *   destination: 'public',
 *   overwrite: false,
 *   preserveTimestamps: true,
 *   filter: ['**\/*.{jpg,png}', '!**\/*.svg']
 * }));
 */
function plugin( options ) {
  // Normalize options with defaults
  options = normalizeOptions( options );

  // Return the plugin function
  // Note: 'files' parameter is required by Metalsmith plugin API but not used by this plugin
  return function metalsmithStaticFiles( files, metalsmith, done ) {
    try {
      const debug = metalsmith.debug ? metalsmith.debug( debugNs ) : () => { };

      debug( 'Running with options: %o', options );

      // Resolve source and destination paths
      const source = metalsmith.path( options.source );
      const destination = metalsmith.path( metalsmith.destination(), options.destination );

      debug( 'Source directory: %s', source );
      debug( 'Destination directory: %s', destination );

      // Ensure source directory exists
      if ( !fs.existsSync( source ) ) {
        const errorMessage = `An error occurred while copying the directory: Source directory does not exist: ${ source }`;
        console.error( errorMessage );
        return done( errorMessage );
      }

      // Create copy options
      const copyOptions = {
        overwrite: options.overwrite,
        preserveTimestamps: options.preserveTimestamps,
        filter: options.filter ?
          ( src ) => {
            // If it's a directory, always include it
            if ( fs.statSync( src ).isDirectory() ) { return true; }

            // Otherwise, apply the filter patterns
            return options.filter.some( pattern =>
              new RegExp( pattern.replace( /\*/g, '.*' ) ).test( src ) );
          } :
          undefined
      };

      // Copy the directory
      fs.copy( source, destination, copyOptions )
        .then( () => {
          debug( 'Successfully copied files from %s to %s', source, destination );
          done();
        } )
        .catch( ( err ) => {
          const errorMessage = `An error occurred while copying the directory: ${ err.message }`;
          console.error( errorMessage );
          done( errorMessage );
        } );
    } catch ( err ) {
      const errorMessage = `Unexpected error in metalsmith-static-files: ${ err.message }`;
      console.error( errorMessage );
      done( errorMessage );
    }
  };
}

/**
 * Export the plugin as the default export.
 *
 * Note on exports:
 * - The main plugin function is exported as the default export
 * - The normalizeOptions function is attached to the default export
 *   but is primarily intended for testing purposes, not public API usage
 */
const metalsmithStaticFiles = plugin;

// Attach normalizeOptions to the plugin for testing purposes
// This avoids having mixed named and default exports while still
// making the function available for tests
metalsmithStaticFiles.normalizeOptions = normalizeOptions;

export default metalsmithStaticFiles;

