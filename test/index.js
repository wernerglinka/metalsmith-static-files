'use strict';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import assert from 'assert';
import equals from 'assert-dir-equal';
import { describe, it } from 'mocha';
import Metalsmith from 'metalsmith';
import plugin from '../lib/index.js';
import path from 'path';
import fs from 'fs';

// ESM does not currently import JSON modules by default.
// Ergo we'll JSON.parse the file manually

const { name } = JSON.parse( fs.readFileSync( './package.json' ) );

const fixture = ( p ) => {
  return path.resolve( dirname( fileURLToPath( import.meta.url ) ), 'fixtures', p );
};

describe( 'metalsmith-static-files', function () {
  it( 'should export a named plugin function matching package.json name', function () {
    const camelCase = name
      .split( '-' )
      .map( ( word, index ) => {
        // If it's the first word, keep it as is;
        // otherwise capitalize the first letter
        if ( index === 0 ) {
          return word;
        }
        return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
      } )
      .join( '' ); // Join all words back into a string

    assert.strictEqual( plugin().name, camelCase );
  } );
  it( 'should not crash the metalsmith build when using default options', function ( done ) {
    Metalsmith( fixture( 'default' ) )
      .use( plugin() )
      .build( ( err ) => {
        assert.strictEqual( err, null );
        equals( fixture( 'default/build' ), fixture( 'default/expected' ) );
        done();
      } );
  } );
  it( 'should copy a directory to build folder', function ( done ) {
    Metalsmith( fixture( 'copy-directory' ) )
      .use( plugin( {
        source: 'assets',
        destination: 'assets'
      } ) )
      .build( ( err ) => {
        assert.strictEqual( err, null );
        equals( fixture( 'copy-directory/build' ), fixture( 'copy-directory/expected' ) );
        done();
      } );
  } );
} );

