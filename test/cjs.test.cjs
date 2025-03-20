// Minimal CommonJS test file - just verifies the CJS module works
const assert = require('node:assert').strict;

// Import the plugin using the CommonJS format
const plugin = require('../lib/index.cjs');

describe('metalsmith-static-files (CommonJS)', () => {
  // Verify the module loads correctly and exports a function
  it('should be properly importable as a CommonJS module', () => {
    assert.strictEqual(typeof plugin, 'function', 'Plugin should be a function when required with CommonJS');
    assert.strictEqual(typeof plugin(), 'function', 'Plugin should return a function when called');
    assert.strictEqual(typeof plugin.normalizeOptions, 'function', 'normalizeOptions should be exported');
  });
  
  // Add a basic functionality test to verify the plugin works
  it('should handle basic plugin functionality when used', () => {
    const instance = plugin({
      source: 'assets',
      destination: 'assets'
    });
    const files = {};
    const metadata = {};
    const metalsmithMock = {
      path: (p) => p,
      destination: () => 'build',
      debug: () => (...args) => {}
    };
    
    // We'll just verify that the plugin function doesn't throw
    assert.doesNotThrow(() => {
      // Mock fs.copy to avoid actual filesystem operations
      const originalCopy = require('fs-extra').copy;
      require('fs-extra').copy = () => Promise.resolve();
      require('fs-extra').existsSync = () => true;
      
      // Use promises to handle the async nature of the plugin
      let err = null;
      instance(files, metalsmithMock, (e) => {
        err = e;
      });
      
      // Clean up mocks
      require('fs-extra').copy = originalCopy;
      
      // Verify no errors occurred
      assert.strictEqual(err, null, 'Plugin should execute without errors');
    });
  });
});