module.exports = function(ch, initialState, render) {
  function renderLoop(state) {
    ch.take(function(acts) {
      var nextState = acts.reduce(function(stateAcc, act) {
        return act(stateAcc)
      }, state)

      render(nextState, state)
      setTimeout(renderLoop.bind(null, nextState))
    })
  }

  renderLoop(initialState)
  render(initialState, null)
}
