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

  it('calls the state listener with the initial state', done => {
    const { set, start } = createState<BasicState>()
    const listener = sinon.spy()
    start(initialState, listener)
    assert(listener.calledWith(initialState))

    set(s => ({ ...s, b: 3 }))
    setTimeout(() => {
      assert(listener.calledWithMatch({ a: 'A', b: 3, c: true }))
      done()
    })
  })

  it('calls the state listener once per series of set calls', done => {
    const { set, start } = createState<BasicState>()
    const listener = sinon.spy()
    start(initialState, listener)
    set(s => ({ ...s, b: 3 }))
    set(s => ({ ...s, c: false }))
    setTimeout(() => {
      assert(!listener.calledWithMatch({ a: 'A', b: 3, c: true }))
      assert(!listener.calledWithMatch({ a: 'A', b: 2, c: false }))
      assert(listener.calledWithMatch({ a: 'A', b: 3, c: false }))
      done()
    })
  })

  it('calls the listener once when few set are called one after another', done => {
    const { set, start } = createState<BasicState>()
    const listener = sinon.spy()
    start(initialState, listener)
    set(s => ({ ...s, b: 3 }))
    set(s => ({ ...s, c: false }))
    setTimeout(() => {
      assert(!listener.calledWithMatch({ a: 'A', b: 3, c: true }))
      assert(!listener.calledWithMatch({ a: 'A', b: 2, c: false }))
      assert(listener.calledWithMatch({ a: 'A', b: 3, c: false }))
      done()
    })
  })

  it('allows to access the state with get', done => {
    const { get, start } = createState<BasicState>()
    start(initialState, () => {
      assert.deepEqual(get(), initialState)
      done()
    })
  })
})
