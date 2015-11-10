module.exports = (ch, initialState, render, rescue) => {
  function renderLoop(state) {
    ch.take()
      .then((actions) => {
        return actions.reduce((stateAcc, action) => action(stateAcc), state)
      })
      .then((nextState) => {
        render(nextState, state)
        renderLoop(nextState)
      })
      .catch((e) => {
        if (rescue) {
          rescue(e)
        } else {
          setImmediate(() => { throw e })
        }
      })
  }

  renderLoop(initialState)
}
