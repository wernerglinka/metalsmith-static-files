# metalsmith-static-files

## ⚠️ DEPRECATED

**This plugin is deprecated.** As of **Metalsmith 2.7.0**, use the built-in `statik()` method instead:

```js
Metalsmith(__dirname)
  .statik('assets/**')  // Pass-through copy without memory overhead
  .build()
```

The built-in `statik()` method offers better performance (native `fs.copyFile` without reading into memory) and is maintained as part of Metalsmith core.

See [Metalsmith #361](https://github.com/metalsmith/metalsmith/issues/361) for details.

---

A Metalsmith plugin to copy a directory to the build directory

[![metalsmith:plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![license: MIT][license-badge]][license-url]
[![coverage][coverage-badge]][coverage-url]
[![ESM/CommonJS][modules-badge]][npm-url]
[![Known Vulnerabilities](https://snyk.io/test/npm/wernerglinka/metalsmith-static-files/badge.svg)](https://snyk.io/test/npm/metalsmith-static-files)

## Features

- Compatible with Metalsmith 2.7.0+ (and earlier versions)
- This plugin supports both ESM and CommonJS environments with no configuration needed:
  - ESM: `import staticFiles from 'metalsmith-static-files'`
  - CommonJS: `const staticFiles = require('metalsmith-static-files')`

## Upgrading to v3.0.0

Version 3.0.0 is a **breaking change** that ensures compatibility with Metalsmith 2.7.0+.

**What changed:** The plugin now adds files to the Metalsmith `files` object instead of copying directly to disk. This ensures static files survive Metalsmith's clean phase, which changed in version 2.7.0.

**Migration:** No code changes required. The API is identical - just update the package version. The change is internal to how files are handled.

**Why this matters:** Metalsmith 2.7.0 changed the build order so that `clean` runs after plugins but before writing files. The previous approach (direct filesystem copy) would have files deleted by the clean phase. The new approach integrates properly with Metalsmith's file handling.

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

| Option               | Type      | Default      | Description                                            |
| -------------------- | --------- | ------------ | ------------------------------------------------------ |
| `source`             | `string`  | `src/assets` | Source directory path relative to Metalsmith root      |
| `destination`        | `string`  | `assets`     | Destination directory path relative to build directory |
| `overwrite`          | `boolean` | `true`       | Whether to overwrite existing files                    |
| `preserveTimestamps` | `boolean` | `false`      | Whether to preserve timestamps when copying files      |
| `ignore`             | `array`   | -            | Array of glob patterns to exclude files (optional)     |

## Examples

### Basic Usage

```js
import Metalsmith from 'metalsmith'
import staticFiles from 'metalsmith-static-files'

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(staticFiles())
  .build((err) => {
    if (err) throw err
    console.log('Build complete!')
  })
```

### With Options

```js
import Metalsmith from 'metalsmith'
import staticFiles from 'metalsmith-static-files'

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(
    staticFiles({
      source: 'static',
      destination: 'public',
      overwrite: false,
      preserveTimestamps: true,
      ignore: ['**/*.tmp', '**/*.log'] // Exclude temporary files
    })
  )
  .build((err) => {
    if (err) throw err
  })
```

### Advanced Usage

#### Using Ignore Patterns

```js
metalsmith.use(
  staticFiles({
    source: 'static',
    destination: 'public',
    overwrite: false, // Don't overwrite existing files
    preserveTimestamps: true, // Keep original timestamps
    ignore: ['**/*.tmp', '**/*.bak', '**/cache/**'] // Exclude temporary files and cache
  })
)
```

#### Common Use Cases

```js
// Exclude specific files
metalsmith.use(
  staticFiles({
    source: 'lib/assets/',
    destination: 'assets/',
    ignore: ['main.css', 'main.js'] // Exclude processed files
  })
)

// Exclude entire directories (all patterns work the same)
metalsmith.use(
  staticFiles({
    source: 'lib/assets/',
    destination: 'assets/',
    ignore: ['styles/', 'temp/', 'cache/'] // Exclude entire directories
  })
)

// Mixed patterns
metalsmith.use(
  staticFiles({
    source: 'lib/assets/',
    destination: 'assets/',
    ignore: [
      '*.tmp', // Exclude temp files
      '*.log', // Exclude log files
      'styles/', // Exclude styles directory
      'node_modules/', // Exclude node_modules directory
      '**/.DS_Store' // Exclude .DS_Store files everywhere
    ]
  })
)
```

#### Directory Exclusion Patterns

**Key Feature**: All directory patterns exclude the **entire directory structure** - no empty directories are created.

All of these patterns have identical behavior and exclude the complete directory:

- `'styles/'` - Directory with trailing slash
- `'styles/*'` - All files in directory  
- `'styles/**'` - Directory and all subdirectories

**Important**: The plugin excludes directories at the directory level, not just their contents. This means when you use any of these patterns, the entire `styles/` directory and everything inside it will be completely excluded from the copy operation. No empty `styles/` directory will be created in the destination.

**Example**:
```
Source directory:
assets/
├── images/
│   └── logo.png
├── styles/
│   ├── main.css
│   └── components/
│       └── button.css
└── scripts/
    └── app.js

With ignore: ['styles/']

Result directory:
assets/
├── images/
│   └── logo.png
└── scripts/
    └── app.js
```

Notice: No empty `styles/` directory is created - it's completely excluded.

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
[coverage-badge]: https://img.shields.io/badge/test%20coverage-97%25-brightgreen
[coverage-url]: https://github.com/wernerglinka/metalsmith-static-files/actions/workflows/test.yml
[modules-badge]: https://img.shields.io/badge/modules-ESM%2FCJS-blue
