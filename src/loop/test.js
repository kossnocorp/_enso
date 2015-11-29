var assert = require('power-assert')
var loop = require('./')
var ch = require('../ch')

describe('loop', function() {
  var isBrowser = typeof window != 'undefined'

  var actsCh
  beforeEach(function() {
    actsCh = ch()
  })

  it('makes initial render call with an initial state', function() {
    var initialState = []
    var render = sinon.spy()
    loop(actsCh.take, initialState, render)
    assert(render.calledWithExactly(initialState, null))
  })

  it('passes state modified by acts', function() {
    var render = sinon.spy()
    loop(actsCh.take, [], render)

    actsCh.act(function(state) {
      return state.concat(1)
    })

    actsCh.act(function(state) {
      return state.concat(2)
    })

    assert(render.calledWith([1, 2]))
  })

  it('passes next state once it is ready', function() {
    var render = sinon.spy()
    loop(actsCh.take, [], render)

    actsCh.act(function(state) {
      return state.concat(1)
    })

    actsCh.act(function(state) {
      return state.concat(2)
    })

    assert(render.calledWith([1]))
    assert(render.calledWith([1, 2]))
    assert(render.calledThrice)
  })

  it('passes previous state', function() {
    var render = sinon.spy()
    var states = []
    loop(actsCh.take, [], function(state, prevState) {
      states.push([state, prevState])
    })

    actsCh.act(function(state) {
      return state.concat(1)
    })

    actsCh.act(function(state) {
      return state.concat(2)
    })

    assert(states[1][1] === states[0][0])
  })

  describe('exceptions handling', function() {
    var errListeners
    var errSpy
    beforeEach(function() {
      errSpy = sinon.spy()

      if (isBrowser) {
        errListeners = window.onerror
        window.onerror = errSpy
      } else {
        errListeners = process.listeners('uncaughtException')
        process.removeAllListeners('uncaughtException')
        process.on('uncaughtException', errSpy)
      }
    })

    afterEach(function() {
      if (isBrowser) {
        window.onerror = errListeners
      } else {
        process.removeAllListeners('uncaughtException')
        errListeners.forEach(function(listener) {
          process.on('uncaughtException', listener)
        })
      }
    })

    it('keeps processing acts when one of act failed', function(done) {
      var render = sinon.spy()
      loop(actsCh.take, [], render)

      actsCh.act(function(state) {
        return state.concat(1)
      })

      actsCh.act(function(state) {
        boom()
        return state.concat(2)
      })

      actsCh.act(function(state) {
        return state.concat(3)
      })

      assert(render.calledWith([1, 3]))

      // Wait for async exception throw
      setTimeout(done)
    })

    it('throws uncaught exception', function(done) {
      loop(actsCh.take, [], function() {})
      actsCh.act(function() { boom() })

      setTimeout(function() {
        assert(errSpy.called)
        done()
      })
    })

    it('keeps loop running', function(done) {
      var render = sinon.spy()
      loop(actsCh.take, [], render)

      actsCh.act(function(state) {
        return state.concat(1)
      })

      actsCh.act(function(state) {
        boom()
      })

      // Wait for async exception throw
      setTimeout(function() {
        actsCh.act(function(state) {
          return state.concat(3)
        })

        assert(render.calledWith([1, 3]))
        done()
      })
    })
  })
})
