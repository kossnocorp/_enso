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
    }, 50)
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
      }, 50)
    }, 50)
  })

  it('passes previous state', function() {
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
      }, 50)
    }, 50)
  })

  describe('exception handling', function() {
    afterEach(function() {
      window.onerror = null
    })

    context('when rescue function is not passed', function() {
      it('throw a global exception if action is failed', function(done) {
        window.onerror = function(e) {
          assert(e.toString().match(/ReferenceError/))
          done()
        }

        loop(actionsCh, [], function() {})
        actionsCh.put(function() { nope() })
      })
    })

    context('when rescue function is not passed', function() {
      it('pass an exception to rescue function', function(done) {
        loop(actionsCh, [], function() {}, function(e) {
          assert(e.toString().match(/ReferenceError/))
          done()
        })
        actionsCh.put(function() { nope() })
      })

      it('do not throw a global exception', function(done) {
        window.onerror = sinon.spy()

        loop(actionsCh, [], function() {}, function() {})
        actionsCh.put(function() { nope() })

        setTimeout(function() {
          assert(!window.onerror.called)
          done()
        }, 50)
      })
    })
  })
})
