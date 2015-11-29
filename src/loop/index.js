module.exports = function(take, initialState, render) {
  function renderLoop(state) {
    take(function(acts) {
      var nextState = acts.reduce(function(stateAcc, act) {
        try {
          return act(stateAcc)
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
