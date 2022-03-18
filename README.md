# metalsmith-static

A Metalsmith plugin to copy a directory to the build directory

[![metalsmith:plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![license: MIT][license-badge]][license-url]

## Installation

NPM:

```
npm install metalsmith-static
```

Yarn:

```
yarn add metalsmith-static
```

## Usage

Pass `metalsmith-static` to `metalsmith.use`. The `source` directory path is resolved to `metalsmith.directory()`. The `destination` path is resolved to `metalsmith.destination()`.

```js
const add = require('metalsmith-static')

metalsmith.use(add({
  source: 'src/assets/',
  destination: 'assets/',
}))
```

## Plugin order
Typically, you want to use this plugin somewhere at the start of the chain, before any asset plugins are run, like @metalsmith/sass.

### Debug

To enable debug logs, set the `DEBUG` environment variable to `metalsmith-static`:

Linux/Mac:

```
DEBUG=metalsmith-static
```

Windows:

```
set "DEBUG=metalsmith-static"
```

### CLI usage

To use this plugin with the Metalsmith CLI, add `metalsmith-static` to the `plugins` key in your `metalsmith.json` file:

```json
{
  "plugins": [
    {
      "metalsmith-static": {}
    }
  ]
}
```

## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/metalsmith-static.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-static
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[license-badge]: https://img.shields.io/github/license/wernerglinka/metalsmith-static
[license-url]: LICENSE
