const assert = require('power-assert')
const loop = require('.')
const ch = require('../ch')

describe('loop', () => {
  var actionsCh
  beforeEach(() => {
    actionsCh = ch()
  })

  it('passes state modified by putted actions', (done) => {
    loop(actionsCh, [], (state) => {
      assert.deepEqual(state, [1, 2])
      done()
    })

    actionsCh.put((state) => {
      return state.concat(1)
    })

    actionsCh.put((state) => {
      return state.concat(2)
    })
  })

  it('passes next state once it is ready', (done) => {
    const render = sinon.spy()
    loop(actionsCh, [], render)

    actionsCh.put((state) => {
      return state.concat(1)
    })

    setTimeout(() => {
      actionsCh.put((state) => {
        return state.concat(2)
      })

      setTimeout(() => {
        assert(render.calledWith([1]))
        assert(render.calledWith([1, 2]))
        done()
      }, 50)
    }, 50)
  })

  it('passes previous state', () => {
    const render = sinon.spy()
    const states = []
    loop(actionsCh, [], (state, prevState) => {
      states.push([state, prevState])
    })

    actionsCh.put((state) => {
      return state.concat(1)
    })

    setTimeout(() => {
      actionsCh.put((state) => {
        return state.concat(2)
      })

      setTimeout(() => {
        assert(states[1][1] === states[0][0])
        done()
      }, 50)
    }, 50)
  })

  describe('exception handling', () => {
    afterEach(() => {
      window.onerror = null
    })

    context('when rescue function is not passed', () => {
      it('throw a global exception if action is failed', (done) => {
        window.onerror = (e) => {
          assert(e.toString().match(/ReferenceError/))
          done()
        }

        loop(actionsCh, [], () => {})
        actionsCh.put(() => { nope() })
      })
    })

    context('when rescue function is not passed', () => {
      it('pass an exception to rescue function', (done) => {
        loop(actionsCh, [], () => {}, (e) => {
          assert(e.toString().match(/ReferenceError/))
          done()
        })
        actionsCh.put(() => { nope() })
      })

      it('do not throw a global exception', (done) => {
        window.onerror = sinon.spy()

        loop(actionsCh, [], () => {}, () => {})
        actionsCh.put(() => { nope() })

        setTimeout(() => {
          assert(!window.onerror.called)
          done()
        }, 50)
      })
    })
  })
})
