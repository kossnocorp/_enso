var nextTick = typeof window != 'undefined' ? window.setImmediate : process.nextTick.bind(process)

module.exports = function(ch, initialState, render, rescue) {
  function renderLoop(state) {
    ch.take()
      .then(function(actions) {
        return actions.reduce(function(stateAcc, action) {
          return action(stateAcc)
        }, state)
      })
      .then(function(nextState) {
        render(nextState, state)
        renderLoop(nextState)
      })
      .catch(function(e) {
        if (rescue) {
          rescue(e)
        } else {
          nextTick(function() { throw e })
        }
      })
  }

  renderLoop(initialState)
  render(initialState, null)
}
