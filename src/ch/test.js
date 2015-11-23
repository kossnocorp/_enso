var assert = require('power-assert')
var ch = require('./')

describe('ch', function() {
  var actsCh
  beforeEach(function() {
    actsCh = ch()
  })

  it('returns an object with take & act functions', function() {
    assert(typeof actsCh == 'object')
    assert(typeof actsCh.take == 'function')
    assert(typeof actsCh.act == 'function')
  })

  describe('take & act', function() {
    it('calls passed function when act is called', function(done) {
      var act = function() {}
      actsCh.take(function(nextActs) {
        assert(nextActs[0] === act)
        done()
      })

      actsCh.act(act)
    })

    it('allows to put an array', function(done) {
      var actA = function() {}
      var actB = function() {}
      actsCh.take(function(nextActs) {
        assert(nextActs[0] === actA)
        assert(nextActs[1] === actB)
        done()
      })

      actsCh.act([actA, actB])
    })

    it('flushes already resolved acts', function(done) {
      actsCh.take(function() {
        var act = function() {}

        actsCh.take(function(nextActs) {
          assert(nextActs[0] === act)
          assert(nextActs.length == 1)
          done()
        })

        actsCh.act(act)
      })

      actsCh.act(function() {})
    })

    it('calls passed function if act was putted before take call', function() {
      var spy = sinon.spy()
      actsCh.act(function() {})
      actsCh.take(spy)
      assert(spy.calledOnce)
    })
  })
})
