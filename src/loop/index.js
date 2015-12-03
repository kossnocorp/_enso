module.exports = function(take, initialState, render, processor) {
  function renderLoop(state) {
    take(function(acts) {
      var nextState = acts.reduce(function(stateAcc, act) {
        try {
          const newState = act(stateAcc)
          return processor ? processor(newState, stateAcc, act) : newState
        } catch(err) {
          setTimeout(function() { throw err })
          return stateAcc
        }
      }, state)

      render(nextState, state)
      renderLoop(nextState)
    })
  }

  renderLoop(initialState)
  render(initialState, null)
}
