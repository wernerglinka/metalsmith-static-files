const debug = require("debug")("metalsmith-static-files");
const fs = require("fs-extra");

/**
 * @typedef Options
 * @property {String} key
 */

/** @type {Options} */
const defaults = {};

/**
 * Normalize plugin options
 * @param {Options} [options]
 * @returns {Object}
 */
function normalizeOptions(options) {
  return Object.assign({}, defaults, options || {});
}

/**
 * A Metalsmith plugin to add a directory to the build folder
 * Typical use case is to copy an asset directory to the build directory
 *
 * @param {Options} options
 * @returns {import('metalsmith').Plugin}
 */
function initStaticFiles(options) {
  options = normalizeOptions(options);
  if (Object.keys(options).length === 0) {
    debug('Found no options')
    return function static() {}
  }
  debug('Running with options: %O', options);

  return function staticFiles(files, metalsmith, done) {

    const source = metalsmith.path(options.source);
    debug('source directory: %O', source);
    const destination = metalsmith.path(metalsmith.destination(), options.destination);
    debug('destination directory: %O', destination);

    fs.copy(source, destination)
      .then(() => done())
      .catch((err) => done('An error occured while copying the directory'))

  };
};

module.exports = initStaticFiles;