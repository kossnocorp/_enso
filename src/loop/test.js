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

    context('when act throws an exception', function() {
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

    context('when render throws an exception', function() {
      context('when initial render is failing', function() {
        it('keeps loop running', function(done) {
          var initial = true
          var render = sinon.spy(function(state) {
            if (initial) {
              initial = false
              boom()
            }
          })
          loop(actsCh.take, [], render)

          setTimeout(function() {
            actsCh.act(function(state) {
              return state.concat(1)
            })
            assert(render.calledWith([1]))
            done()
          })
        })

        it('throws uncaught exception', function(done) {
          var initial = true
          loop(actsCh.take, [], function(state) {
            if (initial) {
              initial = false
              boom()
            }
          })

          setTimeout(function() {
            assert(errSpy.called)
            done()
          })
        })
      })

      context('when loop render is failing', function() {
        it('keeps loop running', function(done) {
          var render = sinon.spy(function(state) {
            if (state.length == 2) {
              boom()
            }
          })
          loop(actsCh.take, [], render)

          actsCh.act(function(state) {
            return state.concat(1)
          })

          actsCh.act(function(state) {
            return state.concat(2)
          })

          // Wait for async exception throw
          setTimeout(function() {
            actsCh.act(function(state) {
              return state.concat(3)
            })

            assert(render.calledWith([1, 2, 3]))
            done()
          })
        })

        it('throws uncaught exception', function(done) {
          var initial = true
          loop(actsCh.take, [], function(state) {
            if (initial) {
              initial = false
            } else {
              boom()
            }
          })
          actsCh.act(function(state) {
            return state.concat(1)
          })

          setTimeout(function() {
            assert(errSpy.called)
            done()
          })
        })
      })
    })
  })

  describe('act processors', function() {
    it('it allows to process act results', function(done) {
      var initialState = [0]
      var processor = sinon.spy(function(state) { return state })
      var addOne = function(state) { return state.concat(1) }
      loop(actsCh.take, initialState, function(newState, prevState) {
        // Wait for second render call
        if (prevState) {
          assert(processor.calledWithExactly(newState, initialState, addOne))
          done()
        }
      }, processor)
      actsCh.act(addOne)
    })

    it('it allows to alter the result', function(done) {
      var initialState = [0]
      var processor = function(state) {
        return ['a', 'b']
      }
      loop(actsCh.take, initialState, function(newState, prevState) {
        // Wait for second render call
        if (prevState) {
          assert.deepEqual(newState, ['a', 'b'])
          done()
        }
      }, processor)
      actsCh.act(function(state) { return state.concat(1) })
    })
  })
})
