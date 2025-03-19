import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import assert from 'node:assert';
import { describe, it, beforeEach, afterEach } from 'mocha';
import Metalsmith from 'metalsmith';
import plugin from '../lib/index.js';
import path from 'path';
import fs from 'fs-extra';

const { name } = JSON.parse( fs.readFileSync( './package.json' ) );

const fixture = ( p ) => {
  return path.resolve( dirname( fileURLToPath( import.meta.url ) ), 'fixtures', p );
};

/**
 * Compare two directories recursively
 * @param {string} actualDir - Path to actual directory
 * @param {string} expectedDir - Path to expected directory
 */
const compareDirectories = (actualDir, expectedDir) => {
  // Get list of files in both directories
  const actualFiles = fs.readdirSync(actualDir).sort();
  const expectedFiles = fs.readdirSync(expectedDir).sort();
  
  // Compare file lists
  assert.deepStrictEqual(actualFiles, expectedFiles, 'Directory contents should match');
  
  // Compare each file/directory
  for (const file of actualFiles) {
    const actualPath = path.join(actualDir, file);
    const expectedPath = path.join(expectedDir, file);
    
    const actualStat = fs.statSync(actualPath);
    const expectedStat = fs.statSync(expectedPath);
    
    // Check if both are directories or both are files
    assert.strictEqual(
      actualStat.isDirectory(),
      expectedStat.isDirectory(),
      `${file} should be the same type in both directories`
    );
    
    if (actualStat.isDirectory()) {
      // Recursively compare subdirectories
      compareDirectories(actualPath, expectedPath);
    } else {
      // Compare file contents
      const actualContent = fs.readFileSync(actualPath, 'utf8');
      const expectedContent = fs.readFileSync(expectedPath, 'utf8');
      assert.strictEqual(actualContent, expectedContent, `Content of ${file} should match`);
    }
  }
};

describe( 'metalsmith-static-files', function() {
  let metalsmith;
  let consoleOutput = {
    warn: [],
    error: []
  };
  const originalConsole = {
    warn: console.warn,
    error: console.error
  };

  beforeEach( function() {
    metalsmith = Metalsmith( fixture( 'default' ) );
    // Reset console output capture
    consoleOutput.warn = [];
    consoleOutput.error = [];
    // Override console methods
    console.warn = ( ...args ) => consoleOutput.warn.push( args.join( ' ' ) );
    console.error = ( ...args ) => consoleOutput.error.push( args.join( ' ' ) );
  } );

  afterEach( async function() {
    // Restore original console methods
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    await fs.remove( fixture( 'default/build' ) ).catch( () => { } );
  } );

  it( 'should export a named plugin function matching package.json name', function() {
    const camelCase = name
      .split( '-' )
      .map( ( word, index ) => {
        if ( index === 0 ) return word;
        return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
      } )
      .join( '' );

    assert.strictEqual( plugin().name, camelCase );
  } );

  it( 'should handle default/empty options gracefully', function( done ) {
    metalsmith
      .use( plugin() )
      .build( ( err ) => {
        assert.strictEqual( err, null );
        compareDirectories( fixture( 'default/build' ), fixture( 'default/expected' ) );
        done();
      } );
  } );

  it( 'should copy a directory to build folder', function( done ) {
    metalsmith = Metalsmith( fixture( 'copy-directory' ) );
    metalsmith
      .use( plugin( {
        source: 'assets',
        destination: 'assets'
      } ) )
      .build( ( err ) => {
        assert.strictEqual( err, null );
        compareDirectories( fixture( 'copy-directory/build' ), fixture( 'copy-directory/expected' ) );
        done();
      } );
  } );

  describe( 'error handling', function() {
    it( 'should handle missing source directory with appropriate error', function( done ) {
      const nonExistentPath = 'non-existent-directory';

      metalsmith
        .use( plugin( {
          source: nonExistentPath,
          destination: 'assets'
        } ) )
        .build( function( err ) {
          try {
            assert( err, 'Expected an error but got none' );
            assert.strictEqual( typeof err, 'string', 'Error should be a string' );
            assert( err.includes( 'error occurred' ), 'Error should mention an error occurred' );
            assert( consoleOutput.error.length > 0, 'Expected error to be logged to console' );
            assert( consoleOutput.error.some( output =>
              output.includes( 'error occurred' ) &&
              output.includes( 'directory' ) ),
              'Console should contain error about directory'
            );
            done();
          } catch ( e ) {
            done( e );
          }
        } );
    } );

    it( 'should handle invalid source path with descriptive error', function( done ) {
      metalsmith
        .use( plugin( {
          source: '../outside-project',
          destination: 'assets'
        } ) )
        .build( function( err ) {
          try {
            assert( err, 'Expected an error but got none' );
            assert.strictEqual( typeof err, 'string', 'Error should be a string' );
            assert( err.includes( 'error occurred' ), 'Error should mention an error occurred' );
            done();
          } catch ( e ) {
            done( e );
          }
        } );
    } );

    it( 'should handle missing destination parameter gracefully', function( done ) {
      metalsmith
        .use( plugin( {
          source: 'assets'
          // destination intentionally omitted
        } ) )
        .build( ( err ) => {
          try {
            assert.strictEqual( err, null, 'Should not error with missing destination' );
            // Verify warning was logged
            assert( consoleOutput.warn.length > 0, 'Expected warning to be logged to console' );
            assert( consoleOutput.warn.some( output =>
              output.includes( 'Missing required options' ) &&
              output.includes( 'destination' ) ),
              'Console should warn about missing destination'
            );
            // Build should complete but no files should be copied
            compareDirectories( fixture( 'default/build' ), fixture( 'default/expected' ) );
            done();
          } catch ( e ) {
            done( e );
          }
        } );
    } );
  } );
} );

