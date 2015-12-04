module.exports = function(take, initialState, render, processor) {
  function loopRender(state, prevState) {
    try {
      render(state, prevState)
    } catch(err) {
      setTimeout(function() { throw err })
    }
    renderLoop(state)
  }

  function renderLoop(state) {
    take(function(acts) {
      var nextState = acts.reduce(function(stateAcc, act) {
        try {
          var newState = act(stateAcc)
          return processor ? processor(newState, stateAcc, act) : newState
        } catch(err) {
          setTimeout(function() { throw err })
          return stateAcc
        }
      }, state)

      loopRender(nextState, state)
    })
  }

  loopRender(initialState, null)
}
