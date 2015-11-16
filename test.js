if (typeof window != 'undefined') {
  require('babel-polyfill')
} else {
  global.sinon = require('sinon')
}

require('./src/ch/test')
require('./src/loop/test')

var assert = require('power-assert')
var enso = require('./')

describe('enso', function() {
  it('exports loop & act functions', function() {
    assert(enso.loop typeof 'function')
  })

  it('wraps channel & loop', function(done) {
    var render = sinon.spy()
    enso.loop([], render)
    enso.act(function(state) { return state.concat(1) })
    setTimeout(function() {
      assert(render.calledWith([1]))
      done()
    }, 25)
  })
})
