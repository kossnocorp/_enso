import assert from 'assert'
import createState from '.'
import sinon from 'sinon'

describe('enso', () => {
  interface BasicState {
    a: string
    b: number
    c: boolean
  }

  const initialState = {
    a: 'A',
    b: 2,
    c: true
  }

  describe('createState', () => {
    it('creates state API', () => {
      const { get, set, loop } = createState<BasicState>(initialState)
      assert(typeof get === 'function')
      assert(typeof set === 'function')
      assert(typeof loop === 'function')
    })

    it('applies initial state', () => {
      const { get } = createState<BasicState>(initialState)
      assert.deepEqual(get(), initialState)
    })
  })

  describe('set', () => {
    it('applies new state', done => {
      const { get, set } = createState<BasicState>(initialState)
      set(s => ({ ...s, b: 3, c: false }))
      setTimeout(() => {
        assert.deepEqual(get(), { a: 'A', b: 3, c: false })
        done()
      })
    })

    it('applies all setters at once', done => {
      const { get, set } = createState<BasicState>(initialState)
      set(s => ({ ...s, b: 3 }))
      set(s => ({ ...s, c: false }))
      setTimeout(() => {
        assert.deepEqual(get(), { a: 'A', b: 3, c: false })
        done()
      })
    })
  })

  describe('get', () => {
    it('returns current state', done => {
      const { get, set } = createState<BasicState>(initialState)
      set(s => ({ ...s, b: 3 }))
      setTimeout(() => {
        assert.deepEqual(get(), { a: 'A', b: 3, c: true })
        done()
      })
    })
  })

  describe('loop', () => {
    it('calls the listener with the initial state', done => {
      const { set, loop } = createState<BasicState>(initialState)
      const listener = sinon.spy()
      loop(listener)
      assert(listener.calledWith(initialState))

      set(s => ({ ...s, b: 3 }))
      setTimeout(() => {
        assert(listener.calledWithMatch({ a: 'A', b: 3, c: true }))
        done()
      })
    })

    it('calls the listener once when few set are called one after another', done => {
      const { set, loop } = createState<BasicState>(initialState)
      const listener = sinon.spy()
      loop(listener)
      set(s => ({ ...s, b: 3 }))
      set(s => ({ ...s, c: false }))
      setTimeout(() => {
        assert(!listener.calledWithMatch({ a: 'A', b: 3, c: true }))
        assert(!listener.calledWithMatch({ a: 'A', b: 2, c: false }))
        assert(listener.calledWithMatch({ a: 'A', b: 3, c: false }))
        done()
      })
    })
  })
})
