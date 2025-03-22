# metalsmith-static-files

A Metalsmith plugin to copy a directory to the build directory

[![metalsmith:plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![license: MIT][license-badge]][license-url]
[![coverage][coverage-badge]][coverage-url]
[![ESM/CommonJS][modules-badge]][npm-url]

## Installation

NPM:

```
npm install metalsmith-static-files
```

Yarn:

```
yarn add metalsmith-static-files
```

## Usage

Pass `metalsmith-static-files` to `metalsmith.use`. The `source` directory path is resolved to `metalsmith.directory()`. The `destination` path is resolved to `metalsmith.destination()`.

### ESM (ES Modules)

```js
import staticFiles from 'metalsmith-static-files';

metalsmith.use(staticFiles({
  source: 'src/assets/',
  destination: 'assets/',
}));
```

### CommonJS

```js
const staticFiles = require('metalsmith-static-files');

metalsmith.use(staticFiles({
  source: 'src/assets/',
  destination: 'assets/',
}))
```

## Options

The plugin accepts the following options:

| Option               | Type      | Default | Description                                               |
|----------------------|-----------|---------|-----------------------------------------------------------|
| `source`             | `string`  | -       | Source directory path relative to Metalsmith root (required) |
| `destination`        | `string`  | -       | Destination directory path relative to build directory (required) |
| `overwrite`          | `boolean` | `true`  | Whether to overwrite existing files                       |
| `preserveTimestamps` | `boolean` | `false` | Whether to preserve timestamps when copying files         |
| `filter`             | `array`   | -       | Array of glob patterns to include/exclude files (optional) |

### Advanced Usage

Here's an example with advanced options:

```js
metalsmith.use(staticFiles({
  source: 'static',
  destination: 'public',
  overwrite: false,            // Don't overwrite existing files
  preserveTimestamps: true,    // Keep original timestamps
  filter: ['**/*.{jpg,png}', '!**/*.svg'] // Only include jpg/png files, exclude svg
}));
```

## Plugin order
Typically, you want to use this plugin somewhere at the start of the chain, before any asset plugins are run, like @metalsmith/sass.

### Debug

This plugin supports Metalsmith's built-in debugging capabilities. To enable debug logs, use the debug option in Metalsmith:

```js
// To debug just this plugin
const metalsmith = Metalsmith(__dirname)
  .debug(['metalsmith-static-files'])
  .use(staticFiles({
    source: 'assets',
    destination: 'assets'
  }));

// Or to debug all plugins
const metalsmith = Metalsmith(__dirname)
  .debug(true)
  .use(staticFiles({
    source: 'assets',
    destination: 'assets'
  }));
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

## Test Coverage

This project maintains high statement and line coverage for the source code. Coverage is verified during the release process using the c8 coverage tool.

Coverage report (from latest test run):

File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files | 97.88 | 96 | 100 | 97.88 |
 index.js | 97.88 | 96 | 100 | 97.88 | 140-142



## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/metalsmith-static-files.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-static-files
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[license-badge]: https://img.shields.io/github/license/wernerglinka/metalsmith-static-files
[license-url]: LICENSE
[coverage-badge]: https://img.shields.io/badge/coverage-98%25-brightgreen.svg
[coverage-url]: https://github.com/wernerglinka/metalsmith-optimize-html/blob/master/README.md
[modules-badge]: https://img.shields.io/badge/modules-ESM%2FCJS-blue