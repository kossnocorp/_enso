module.exports = function(take, initialState, render) {
  function renderLoop(state) {
    take(function(acts) {
      var nextState = acts.reduce(function(stateAcc, act) {
        return act(stateAcc)
      }, state)

      render(nextState, state)
      renderLoop(nextState)
    })
  }

  renderLoop(initialState)
  render(initialState, null)
}
