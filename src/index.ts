export type Setter<State> = (currentState: State) => State

export type Listener<State> = (
  newState: State,
  prevState: State | undefined
) => void

export default function createState<State>() {
  let currentState: State
  let listener: Listener<State>
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
      listener(newState, prevState)
    })
  }

  function start(initialState: State, listenerArg: Listener<State>) {
    currentState = initialState
    listener = listenerArg
    listener(initialState, undefined)
  }

  return { get, set, start }
}
