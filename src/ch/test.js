const assert = require('power-assert')
const ch = require('.')

describe('ch', () => {
  it('returns an object with take & put functions', () => {
    const actionsCh = ch()
    assert(typeof actionsCh == 'object')
    assert(typeof actionsCh.take == 'function')
    assert(typeof actionsCh.put == 'function')
  })

  describe('take & put', () => {
    var actionsCh
    beforeEach(() => {
      actionsCh = ch()
    })

    it('returns a promise', () => {
      assert(actionsCh.take() instanceof Promise)
    })

    it('resolves the promise when action is putted', (done) => {
      const action = () => {}
      actionsCh.take()
        .then((nextActions) => {
          assert(nextActions[0] === action)
        })
        .then(done)

      actionsCh.put(action)
    })

    it('resolves the promise with array of consequentially putted actions', (done) => {
      const actionA = () => {}
      const actionB = () => {}
      actionsCh.take()
        .then((nextActions) => {
          assert(nextActions[0] === actionA)
          assert(nextActions[1] === actionB)
        })
        .then(done)

      actionsCh.put(actionA)
      actionsCh.put(actionB)
    })

    it('resolves actions just once', (done) => {
      actionsCh.take()
        .then(() => {
          actionsCh.take().then(assert.bind(false))
          setTimeout(done, 100)
        })
        .then(done)

      for (var i = 0; i < 10; i++) {
        actionsCh.put(() => {})
      }
    })

    it('flushes already resolved actions', (done) => {
      actionsCh.take()
        .then(() => {
          const action = () => {}
          actionsCh.take()
            .then((nextActions) => {
              assert(nextActions[0] === action)
              assert(nextActions.length == 1)
            })
            .then(done)
          actionsCh.put(action)
        })

      actionsCh.put(() => {})
    })

    it('allows to put an array', (done) => {
      const actionA = () => {}
      const actionB = () => {}
      actionsCh.take()
        .then((nextActions) => {
          assert(nextActions[0] === actionA)
          assert(nextActions[1] === actionB)
        })
        .then(done)

      actionsCh.put([actionA, actionB])
    })
  })
})
