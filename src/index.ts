export type Setter<State> = (currentState: State) => State

export type Listener<State> = (
  newState: State,
  prevState: State | undefined
) => void

export function createState<State>(initialState: State) {
  let currentState = initialState
  const listeners: Listener<State>[] = []
  const setters: Setter<State>[] = []
  let updateTimeout: number

  function get(): State {
    return currentState
  }

  function set(setter: Setter<State>): void {
    setters.push(setter)

    clearTimeout(updateTimeout)
    updateTimeout = setTimeout(() => {
      const newState = setters.reduce((s, setter) => setter(s), currentState)
      const prevState = currentState
      currentState = newState
      listeners.forEach(listener => listener(newState, prevState))
    })
  }

  function loop(listener: Listener<State>) {
    listeners.push(listener)
    listener(currentState, undefined)
  }

  return { get, set, loop }
}
