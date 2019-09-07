# Enso

Minimalistic TypeScript-first state managment library for Node.js and browser.

**It's just 130 bytes**! Although it can be used to manage state in complex applications.

**TypeScript-first**. Enso ensures complete type-safety.

```ts
import createState from 'enso'

// Define state
type State = number

// Create typed operations on state with 0 as the initial state
const { get, set, loop } = createState(0)

// Get the current state
const counter = get()
console.log(counter)
//=> 0

// Update state every second
setInterval(() => set(counter => counter + 1), 1000)

// Loop through the state values
loop((newState, prevState) => console.log(newState, prevState))
//=> 0 undefined
//=> 1 0
//=> 2 1
//=> ...
```

## License

[MIT © Sasha Koss](https://kossnocorp.mit-license.org/)
