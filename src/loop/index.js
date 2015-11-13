module.exports = function(ch, initialState, render) {
  function renderLoop(state) {
    ch.take(function(actions) {
      var nextState = actions.reduce(function(stateAcc, action) {
        return action(stateAcc)
      }, state)

      render(nextState, state)

      setTimeout(function() {
        renderLoop(nextState)
      }, 0)
    })
  }

  renderLoop(initialState)
  render(initialState, null)
}
