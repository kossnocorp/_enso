var assert = require('power-assert')
var loop = require('./')
var ch = require('../ch')

describe('loop', function() {
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
})
