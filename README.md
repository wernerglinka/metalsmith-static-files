# metalsmith-static-files

A Metalsmith plugin to copy a directory to the build directory

[![metalsmith:plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![license: MIT][license-badge]][license-url]
[![coverage][coverage-badge]][coverage-url]
[![ESM/CommonJS][modules-badge]][npm-url]
[![Known Vulnerabilities](https://snyk.io/test/github/wernerglinka/metalsmith-static-files/badge.svg)](https://snyk.io/test/github/wernerglinka/metalsmith-static-files/badge)

## Features
- This plugin supports both ESM and CommonJS environments with no configuration needed:
  - ESM: `import staticFiles from 'metalsmith-static-files'`
  - CommonJS: `const staticFiles = require('metalsmith-static-files')`

## Installation

```
npm install metalsmith-static-files
```

## Usage

Pass `metalsmith-static-files` to `metalsmith.use`. The `source` directory path is resolved to `metalsmith.directory()`. The `destination` path is resolved to `metalsmith.destination()`.

Typically, you want to use this plugin somewhere at the start of the chain, before any asset plugins are run, like @metalsmith/sass.

```js
metalsmith.use(
  staticFiles({
    source: 'src/assets/',
    destination: 'assets/'
  })
)
```

## Options

The plugin accepts the following options:

| Option               | Type      | Default      | Description                                                |
| -------------------- | --------- | ------------ | ---------------------------------------------------------- |
| `source`             | `string`  | `src/assets` | Source directory path relative to Metalsmith root          |
| `destination`        | `string`  | `assets`     | Destination directory path relative to build directory     |
| `overwrite`          | `boolean` | `true`       | Whether to overwrite existing files                        |
| `preserveTimestamps` | `boolean` | `false`      | Whether to preserve timestamps when copying files          |
| `filter`             | `array`   | -            | Array of glob patterns to include/exclude files (optional) |

### Advanced Usage

Here's an example with advanced options:

```js
metalsmith.use(
  staticFiles({
    source: 'static',
    destination: 'public',
    overwrite: false, // Don't overwrite existing files
    preserveTimestamps: true, // Keep original timestamps
    filter: ['**/*.{jpg,png}', '!**/*.svg'] // Only include jpg/png files, exclude svg
  })
)
```

## Debug

To enable debug logs, set the `DEBUG` environment variable to `metalsmith-static-files`:

```
DEBUG=metalsmith-static-files
```

### CLI usage

To use this plugin with the Metalsmith CLI, add `metalsmith-static-files` to the `plugins` key in your `metalsmith.json` file:

```json
{
  "plugins": [
    {
      "metalsmith-static-files": {}
    }
  ]
}
```

## Author

[werner@glinka.co](https://github.com/wernerglinka)

## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/metalsmith-static-files.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-static-files
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[license-badge]: https://img.shields.io/github/license/wernerglinka/metalsmith-static-files
[license-url]: LICENSE
[coverage-badge]: https://img.shields.io/badge/test%20coverage-100%25-brightgreen
[coverage-url]: https://github.com/wernerglinka/metalsmith-static-files/actions/workflows/test.yml
[modules-badge]: https://img.shields.io/badge/modules-ESM%2FCJS-blue
