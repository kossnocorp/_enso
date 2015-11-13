var assert = require('power-assert')
var ch = require('./')

describe('ch', function() {
  var actionsCh
  beforeEach(function() {
    actionsCh = ch()
  })

  it('returns an object with take & put functions', function() {
    assert(typeof actionsCh == 'object')
    assert(typeof actionsCh.take == 'function')
    assert(typeof actionsCh.put == 'function')
  })

  describe('take & put', function() {
    it('calls passed function when action is putted', function(done) {
      var action = function() {}
      actionsCh.take(function(nextActions) {
        assert(nextActions[0] === action)
        done()
      })

      actionsCh.put(action)
    })

    it('allows to put an array', function(done) {
      var actionA = function() {}
      var actionB = function() {}
      actionsCh.take(function(nextActions) {
        assert(nextActions[0] === actionA)
        assert(nextActions[1] === actionB)
        done()
      })

      actionsCh.put([actionA, actionB])
    })

    it('flushes already resolved actions', function(done) {
      actionsCh.take(function() {
        var action = function() {}

        actionsCh.take(function(nextActions) {
          assert(nextActions[0] === action)
          assert(nextActions.length == 1)
          done()
        })

        actionsCh.put(action)
      })

      actionsCh.put(function() {})
    })

    it('calls passed function if action was putted before take call', function() {
      var spy = sinon.spy()
      actionsCh.put(function() {})
      actionsCh.take(spy)
      assert(spy.calledOnce)
    })

    describe('async put', function() {
      it('resolves the promise with array of consequentially putted actions', function(done) {
        var actionA = function() {}
        var actionB = function() {}
        actionsCh.take(function(nextActions) {
          assert(nextActions[0] === actionA)
          assert(nextActions[1] === actionB)
          done()
        })

        actionsCh.put(actionA, true)
        actionsCh.put(actionB, true)
      })

      it('resolves actions just once', function(done) {
        actionsCh.take(function() {
          actionsCh.take(assert.bind(false))
          setTimeout(done, 1)
        })

        for (var i = 0; i < 10; i++) {
          actionsCh.put(function() {}, true)
        }
      })
    })
  })
})
