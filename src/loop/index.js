module.exports = function(ch, initialState, render) {
  function renderLoop(state) {
    ch.take(function(actions) {
      var nextState = actions.reduce(function(stateAcc, action) {
        return action(stateAcc)
      }, state)

      render(nextState, state)
      setTimeout(renderLoop.bind(null,nextState), 0)
    })
  }

  renderLoop(initialState)
  render(initialState, null)
}
