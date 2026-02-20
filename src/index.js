// Import declarations at the top with a consistent order
import fs from 'fs-extra'
import path from 'path'

// Plugin namespace for debugging
const debugNs = 'metalsmith-static-files'

/**
 * @typedef {Object} Options
 * @property {string} source - Source directory path relative to metalsmith root
 * @property {string} destination - Destination directory path relative to build directory
 * @property {boolean} [overwrite=true] - Whether to overwrite existing files
 * @property {boolean} [preserveTimestamps=false] - Whether to preserve timestamps when copying
 * @property {string[]} [ignore] - Optional array of glob patterns to exclude files
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
}

/**
 * Convert glob pattern to regex
 * @private
 * @param {string} pattern - Glob pattern
 * @returns {RegExp} - Converted regex
 */
function globToRegex(pattern) {
  // Escape special regex characters except * and ?
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]*') // * should not match path separators
    .replace(/\?/g, '[^/]') // ? should not match path separators

  return new RegExp(`^${escaped}$`)
}

/**
 * Check if a file path matches any of the glob patterns
 * @private
 * @param {string} filePath - File path to test
 * @param {string[]} patterns - Array of glob patterns
 * @returns {boolean} - True if file matches any pattern
 */
function matchesAnyPattern(filePath, patterns) {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return false
  }

  return patterns.some((pattern) => {
    // Handle directory patterns specially
    if (pattern.endsWith('/')) {
      // 'styles/' should match any file within the styles directory
      const dirPattern = pattern.slice(0, -1) // Remove trailing slash
      return filePath.startsWith(`${dirPattern}/`) || filePath === dirPattern
    }

    // Handle recursive directory patterns
    if (pattern.endsWith('/**')) {
      // 'styles/**' should match the directory and all subdirectories
      const dirPattern = pattern.slice(0, -3) // Remove '/**'
      return filePath.startsWith(`${dirPattern}/`) || filePath === dirPattern
    }

    // Regular glob pattern matching
    const regex = globToRegex(pattern)
    return regex.test(filePath)
  })
}

/**
 * Normalize plugin options by merging with defaults
 *
 * @private This function is primarily for internal use and testing
 * @param {Options} [options] - User provided options
 * @returns {Options} - Normalized options with defaults applied
 */
function normalizeOptions(options) {
  return { ...defaults, ...(options || {}) }
}

/**
 * Recursively collect all files from a directory
 * @private
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @param {string[]} [ignorePatterns] - Patterns to ignore
 * @param {Function} debug - Debug function
 * @returns {Promise<Array<{relativePath: string, absolutePath: string}>>} - Array of file info
 */
async function collectFiles(dir, baseDir, ignorePatterns, debug) {
  const results = []
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name)
    const relativePath = path.relative(baseDir, absolutePath)

    // Check if this path should be ignored
    if (matchesAnyPattern(relativePath, ignorePatterns)) {
      debug('Ignoring: %s (matches ignore pattern)', relativePath)
      continue
    }

    if (entry.isDirectory()) {
      // Recursively collect files from subdirectory
      const subFiles = await collectFiles(absolutePath, baseDir, ignorePatterns, debug)
      results.push(...subFiles)
    } else if (entry.isFile()) {
      results.push({ relativePath, absolutePath })
    }
  }

  return results
}

/**
 * A Metalsmith plugin to copy static files from a source directory to the build directory.
 * This plugin is useful for including assets that don't require processing,
 * such as images, fonts, or other static resources.
 *
 * As of version 3.0.0, this plugin adds files to the Metalsmith files object
 * instead of copying directly to disk. This ensures compatibility with
 * Metalsmith 2.7.0+ which cleans the destination after plugins run.
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
 *   ignore: ['**\/*.svg', '**\/*.tmp']
 * }));
 */
function plugin(options) {
  // Normalize options with defaults
  options = normalizeOptions(options)

  // Return the plugin function
  return function metalsmithStaticFiles(files, metalsmith, done) {
    try {
      const debug = metalsmith.debug ? metalsmith.debug(debugNs) : () => {}

      debug('Running with options: %o', options)

      // Resolve source path (relative to metalsmith directory)
      const source = metalsmith.path(options.source)

      debug('Source directory: %s', source)
      debug('Destination prefix: %s', options.destination)

      // Ensure source directory exists
      if (!fs.existsSync(source)) {
        const errorMessage = `An error occurred while copying the directory: Source directory does not exist: ${source}`
        console.error(errorMessage)
        return done(errorMessage)
      }

      // Collect and add files to Metalsmith files object
      collectFiles(source, source, options.ignore, debug)
      .then(async (fileList) => {
        for (const { relativePath, absolutePath } of fileList) {
          // Build the destination key (path in the files object)
          const destKey = path.join(options.destination, relativePath)

          // Check if file already exists and handle overwrite option
          if (files[destKey] && !options.overwrite) {
            debug('Skipping %s (already exists and overwrite=false)', destKey)
            continue
          }

          // Read file contents and stats
          const contents = await fs.readFile(absolutePath)
          const stats = await fs.stat(absolutePath)

          // Create Metalsmith file entry
          const fileEntry = {
            contents,
            mode: stats.mode.toString(8).slice(-4),
            stats
          }

          // Add to files object
          files[destKey] = fileEntry
          debug('Added file: %s', destKey)
        }

        debug('Successfully added %d files to build', fileList.length)
        done()
      })
      .catch((err) => {
        const errorMessage = `An error occurred while processing static files: ${err.message}`
        console.error(errorMessage)
        done(errorMessage)
      })
    } catch (err) {
      const errorMessage = `Unexpected error in metalsmith-static-files: ${err.message}`
      console.error(errorMessage)
      done(errorMessage)
    }
  }
}

/**
 * Export the plugin as the default export.
 *
 * Note on exports:
 * - The main plugin function is exported as the default export
 * - The normalizeOptions function is attached to the default export
 *   but is primarily intended for testing purposes, not public API usage
 */
const metalsmithStaticFiles = plugin

// Attach functions to the plugin for testing purposes
// This avoids having mixed named and default exports while still
// making the functions available for tests
metalsmithStaticFiles.normalizeOptions = normalizeOptions
metalsmithStaticFiles.globToRegex = globToRegex
metalsmithStaticFiles.matchesAnyPattern = matchesAnyPattern

export default metalsmithStaticFiles
