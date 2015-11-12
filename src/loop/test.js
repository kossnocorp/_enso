var assert = require('power-assert')
var loop = require('./')
var ch = require('../ch')

describe('loop', function() {
  var actionsCh
  beforeEach(function() {
    actionsCh = ch()
  })

  it('passes state modified by putted actions', function(done) {
    var render = sinon.spy()
    loop(actionsCh, [], render)

    actionsCh.put(function(state) {
      return state.concat(1)
    })

    actionsCh.put(function(state) {
      return state.concat(2)
    })

    setTimeout(function() {
      assert(render.calledWith([1, 2]))
      done()
    }, 0)
  })

  it('makes initial render call with an initial state', function() {
    var initialState = []
    var render = sinon.spy()
    loop(actionsCh, initialState, render)
    assert(render.calledWithExactly(initialState, null))
  })

  it('passes next state once it is ready', function(done) {
    var render = sinon.spy()
    loop(actionsCh, [], render)

    actionsCh.put(function(state) {
      return state.concat(1)
    })

    setTimeout(function() {
      actionsCh.put(function(state) {
        return state.concat(2)
      })

      setTimeout(function() {
        assert(render.calledWith([1]))
        assert(render.calledWith([1, 2]))
        done()
      }, 0)
    }, 0)
  })

  it('passes previous state', function(done) {
    var render = sinon.spy()
    var states = []
    loop(actionsCh, [], function(state, prevState) {
      states.push([state, prevState])
    })

    actionsCh.put(function(state) {
      return state.concat(1)
    })

    setTimeout(function() {
      actionsCh.put(function(state) {
        return state.concat(2)
      })

      setTimeout(function() {
        assert(states[1][1] === states[0][0])
        done()
      }, 0)
    }, 0)
  })

  describe('exception handling', function() {
    var isBrowser = typeof window != 'undefined'

    var uncaughtExceptionListeners

    beforeEach(function() {
      if (isBrowser) {
        uncaughtExceptionListeners = window.onerror
        window.onerror = null
      } else {
        process.removeAllListeners('uncaughtException')
        uncaughtExceptionListeners = process.listeners('uncaughtException')
      }
    })

    afterEach(function() {
      if (isBrowser) {
        window.onerror = uncaughtExceptionListeners
      } else {
        uncaughtExceptionListeners.forEach(process.on.bind(process, 'uncaughtException'))
      }
    })

    function addUncaughtExceptionListener(fn) {
      if (isBrowser) {
        window.onerror = fn
      } else {
        process.on('uncaughtException', fn)
      }
    }

    context('when rescue function is not passed', function() {
      it('throw a global exception if action is failed', function(done) {
        addUncaughtExceptionListener(function(e) {
          assert(e.toString().match(/ReferenceError/))
          done()
        })

        loop(actionsCh, [], function() {})
        actionsCh.put(function() { nope() })
      })
    })

    context('when rescue function is passed', function() {
      it('pass an exception to rescue function', function(done) {
        loop(actionsCh, [], function() {}, function(e) {
          assert(e.toString().match(/ReferenceError/))
          done()
        })
        actionsCh.put(function() { nope() })
      })

      it('do not throw a global exception', function(done) {
        var exceptionListener = sinon.spy()
        addUncaughtExceptionListener(exceptionListener)

        loop(actionsCh, [], function() {}, function() {})
        actionsCh.put(function() { nope() })

        setTimeout(function() {
          assert(!exceptionListener.called)
          done()
        }, 0)
      })
    })
  })
})
