const assert = require('assert')
const equals = require('assert-dir-equal')
const { describe, it } = require('mocha')
const Metalsmith = require('metalsmith')
const { name } = require('../package.json')
const plugin = require('..')

function fixture(p) {
  return require('path').resolve(__dirname, 'fixtures', p)
}

describe('metalsmith-add', function () {
  it('should export a named plugin function matching package.json name', function () {
    const namechars = name.split('-')[1]
    const camelCased = namechars.split('').reduce((str, char, i) => {
      str += namechars[i - 1] === '-' ? char.toUpperCase() : char === '-' ? '' : char
      return str
    }, '')
    assert.strictEqual(plugin().name, camelCased.replace(/~/g, ''))
  })
  it('should not crash the metalsmith build when using default options', function (done) {
    Metalsmith(fixture('default'))
      .use(plugin())
      .build((err) => {
        assert.strictEqual(err, null)
        equals(fixture('default/build'), fixture('default/expected'))
        done()
      })
  })
  it('should copy a directory to build folder', function (done) {
    Metalsmith(fixture('copy-directory'))
      .use(plugin({
        source: 'assets',
        destination: 'assets'
      }))
      .build((err) => {
        assert.strictEqual(err, null)
        equals(fixture('copy-directory/build'), fixture('copy-directory/expected'))
        done()
      })
  })
})
