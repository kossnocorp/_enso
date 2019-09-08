# Enso

Minimalistic TypeScript-first state managment library for Node.js and browser.

**It's just 120 bytes**, but it can be used to manage state in complex applications.

**TypeScript-first** approach ensures complete type-safety.

**Simplistic API** allows to get the state managment out of the way and write code.

```ts
import createState from 'enso'

// Define state
type State = number

// Create typed operations on state
const { get, set, start } = createState<State>()

// Update state every second
setInterval(() => set(counter => counter + 1), 1000)

// Listen to state changes. The passed function is also trigger with the initial state .
const initialCounter = 0
start(initialCounter, (newCounter, prevCounter) =>
  console.log(newCounter, prevCounter)
)
//=> 0 undefined
//=> 1 0
//=> 2 1
//=> ...

// Get the current state
setTimeout(() => console.log(get()), 3000)
//=> 3
```

## License

[MIT © Sasha Koss](https://kossnocorp.mit-license.org/)
