var assert = require('power-assert')
var loop = require('./')
var ch = require('../ch')

describe('loop', function() {
  var actionsCh
  beforeEach(function() {
    actionsCh = ch()
  })

  it('makes initial render call with an initial state', function() {
    var initialState = []
    var render = sinon.spy()
    loop(actionsCh, initialState, render)
    assert(render.calledWithExactly(initialState, null))
  })

  context('when actions are sync', function() {
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
      }, 25)
    })

    it('passes next state once it is ready', function(done) {
      var render = sinon.spy()
      loop(actionsCh, [], render)

      actionsCh.put(function(state) {
        return state.concat(1)
      })

      actionsCh.put(function(state) {
        return state.concat(2)
      })

      assert(render.calledWith([1]))
      assert(render.calledTwice)

      setTimeout(function() {
        assert(render.calledWith([1, 2]))
        assert(render.calledThrice)
        done()
      }, 25)
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

      actionsCh.put(function(state) {
        return state.concat(2)
      })

      setTimeout(function() {
        assert(states[1][1] === states[0][0])
        done()
      }, 25)
    })
  })

  context('when actions are async', function() {
    it('passes state modified by putted actions', function(done) {
      var render = sinon.spy()
      loop(actionsCh, [], render)

      actionsCh.put(function(state) {
        return state.concat(1)
      }, true)

      actionsCh.put(function(state) {
        return state.concat(2)
      }, true)

      setTimeout(function() {
        assert(render.calledWith([1, 2]))
        done()
      }, 25)
    })

    it('passes next state once it is ready', function(done) {
      var render = sinon.spy()
      loop(actionsCh, [], render)

      actionsCh.put(function(state) {
        return state.concat(1)
      }, true)

      setTimeout(function() {
        actionsCh.put(function(state) {
          return state.concat(2)
        }, true)

        setTimeout(function() {
          assert(render.calledWith([1]))
          assert(render.calledWith([1, 2]))
          done()
        }, 25)
      }, 25)

      assert(render.calledOnce)
    })

    it('passes previous state', function(done) {
      var render = sinon.spy()
      var states = []
      loop(actionsCh, [], function(state, prevState) {
        states.push([state, prevState])
      })

      actionsCh.put(function(state) {
        return state.concat(1)
      }, true)

      setTimeout(function() {
        actionsCh.put(function(state) {
          return state.concat(2)
        }, true)

        setTimeout(function() {
          assert(states[1][1] === states[0][0])
          done()
        }, 25)
      }, 25)
    })
  })
})
