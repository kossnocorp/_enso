var assert = require('power-assert')
var ch = require('./')

describe('ch', function() {
  it('returns an object with take & put functions', function() {
    var actionsCh = ch()
    assert(typeof actionsCh == 'object')
    assert(typeof actionsCh.take == 'function')
    assert(typeof actionsCh.put == 'function')
  })

  describe('take & put', function() {
    var actionsCh
    beforeEach(function() {
      actionsCh = ch()
    })

    it('returns a promise', function() {
      assert(actionsCh.take() instanceof Promise)
    })

    it('resolves the promise when action is putted', function(done) {
      var action = function() {}
      actionsCh.take()
        .then(function(nextActions) {
          assert(nextActions[0] === action)
        })
        .then(done)

      actionsCh.put(action)
    })

    it('resolves the promise with array of consequentially putted actions', function(done) {
      var actionA = function() {}
      var actionB = function() {}
      actionsCh.take()
        .then(function(nextActions) {
          assert(nextActions[0] === actionA)
          assert(nextActions[1] === actionB)
        })
        .then(done)

      actionsCh.put(actionA)
      actionsCh.put(actionB)
    })

    it('resolves actions just once', function(done) {
      actionsCh.take()
        .then(function() {
          actionsCh.take().then(assert.bind(false))
          setTimeout(done, 0)
        })

      for (var i = 0; i < 10; i++) {
        actionsCh.put(function() {})
      }
    })

    it('flushes already resolved actions', function(done) {
      actionsCh.take()
        .then(function() {
          var action = function() {}
          actionsCh.take()
            .then(function(nextActions) {
              assert(nextActions[0] === action)
              assert(nextActions.length == 1)
            })
            .then(done)
          actionsCh.put(action)
        })

      actionsCh.put(function() {})
    })

    it('allows to put an array', function(done) {
      var actionA = function() {}
      var actionB = function() {}
      actionsCh.take()
        .then(function(nextActions) {
          assert(nextActions[0] === actionA)
          assert(nextActions[1] === actionB)
        })
        .then(done)

      actionsCh.put([actionA, actionB])
    })
  })
})
