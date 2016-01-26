# Enso
[![Build Status](https://travis-ci.org/kossnocorp/enso.svg?branch=master)](https://travis-ci.org/kossnocorp/enso)

**Minimal data flow loop for async JavaScript applications**: web apps, bots,
servers, etc. Enso allows to eliminate the state and implement unidirectional
data flow.

Enso has **just 2 API methods** and stupid simply inside. However,
it provides solid foundation for an application of **any scale** using
just couple abstractions.

Despite tiny size it requires **no boilerplate code**, but also gives
**room for advanced extensions** like time travel, hot reload, etc.

## Getting Started

### Installation

```bash
npm install enso --save
```

### Usage

```js
var enso = require('enso')
var loop = enso.loop
var act = enso.act

var initialState = 0

loop(initialState, function(state, prevState) {
  console.log(state)
})

setInterval(function() {
  act(function(state) { return state + 1 })
}, 1000)
```

## What

TODO

## Why

* It's tiny and simple:
  - It has 0 dependencies
  - Less than 800 B
  - Less than 60 LOC
  - It has just 2 API methods (and one of them supposed to be called just once)
  - You'll need just few minutes to master Enso
* It's universal and works both in Node.js and a browser

## Examples

### Master Enso in a Couple Minutes

Here is a simplified example of timer application which renders
how many seconds passed:

```js
var enso = require('enso')

// We'll need just these two functions:
var loop = enso.loop
var act = enso.act

// State of application supposed to be kept in a single place.
// State could be any type: an object, an array or
// just a number like in the example.
//
// Our timer starts with 0:
var initialState = 0

// Pass the render function to loop, to trigger it every time
// when the state is changing.
loop(initialState, function(state, prevState) {
  // We are getting two arguments: the new state and the previous one,
  // so you can compare them, save to persistant storage or
  // welcome a user like we do (prevState is null at the initial render call):
  if (prevState === null) {
    console.log('Hello, dear timer user!')
  }

  // Render application state:
  console.log(state)
})

setInterval(function() {
  // act function accepts a function (act) that changes the state.
  // The act will be called immediately and then hit the render loop:
  act(function(state) {
    // Return new state:
    return state + 1
  })
}, 1000)
```

And that's it! Basically any type of application can be built using acts.
See following examples for more use cases.

### React Example

Application root:

```js
var ReactDOM = require('react-dom')
var loop = require('enso').loop
var Counter = require('./counter')

var initialState = 0

var render = function(count, prevCount) {
  ReactDOM.render(
    <Counter count={count} />,
    document.getElementById('canvas')
  )
}

loop(initialState, render)
```

Acts:

```js
var act = require('enso').act

module.exports = {
  inc: function() {
    act(function(count) { return count + 1 })
  },

  dec: function() {
    act(function(count) { return count - 1 })
  }
}
```

Component:

```js
var React = require('react')
var acts = require('app/acts')

var Counter = React.createClass({
  propTypes: {
    count: React.PropTypes.number
  },

  render: function() {
    return <div>
      <p>
        Count: {this.props.count}
      </p>
      <ul>
        <li><button onClick={acts.inc}>+</button></li>
        <li><button onClick={acts.dec}>-</button></li>
      </ul>
    </div>
  }
})

module.exports = Counter
```

### How to Read the State?

Just call act!

```js
act(function(state) {
  console.log('Lovely state: ', state)
  return state
})
```

Believe me, this is the edge case. Usually, you'll read and mutate it
in the single act.

If you are not convinced and disappointed about the latter example,
here is another one:

```js
var act = require('enso').act

function read(fn) {
  act(function(state) {
    fn(state)
    return state
   })
}

read(function(state) {
  console.log('Lovely state: ', state)
})
```

### `waitFor` Implementation

```js
var act = require('enso').act

function fetchUserAndSettings(userId) {
  Promise
    .all([
      new Promise(function(resolve, reject) {
        fetchUser(userId, resolve)
      }),
      new Promise(function(resolve, reject) {
        fetchSettings(null, resolve)
      })
    ])
    .then(act)
}

function fetchUser(id, resolve) {
  resolve = resolve || act

  fetch(`/users/${id}`)
    .then(function(resp) { return resp.json() })
    .then(function(user) {
      resolve(function(state) {
        return state.setIn(['users', id], user)
      })
    })
}

function fetchSettings(_, resolve) {
  resolve = resolve || act

  fetch('/settings')
    .then(function(resp) { return resp.json() })
    .then(function(settings) {
      resolve(function(state) {
        return state.set('settings', settings)
      })
    })
}
```

### Processors (Middlewares)

```js
var loop = require('enso').loop

loop(
  [],
  function(state, prevState) {
    if (prevState === null) {
      console.log('Hello, dear timer user!')
    }
    // Render application state
    console.log(state)
  },
  function(actions) {

  }
)

setInterval(function() {
  // act function accepts a function (act) that change the state.
  // The act will be called immediately and then updated state
  // will go to our render loop:
  act(function(state) {
    // Return new state
    return state + 1
  })
}, 1000)
```

## License

MIT
