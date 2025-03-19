# metalsmith-static-files

A Metalsmith plugin to copy a directory to the build directory

[![metalsmith:plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![license: MIT][license-badge]][license-url]

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

To enable debug logs, set the `DEBUG` environment variable to `metalsmith-static-files`:

Linux/Mac:

```
DEBUG=metalsmith-static-files
```

Windows:

```
set "DEBUG=metalsmith-static-files"
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

## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/metalsmith-static-files.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-static-files
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[license-badge]: https://img.shields.io/github/license/wernerglinka/metalsmith-static-files
[license-url]: LICENSE
