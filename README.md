# Enso
[![Build Status](https://travis-ci.org/kossnocorp/enso.svg?branch=master)](https://travis-ci.org/kossnocorp/enso)

Minimal data flow loop for async applications.

## Installation

```npm
npm install enso --save
```

## What

TODO

## Why

* It's tiny and simple:
  - It has 0 dependencies
  - Less than 700 B
  - Less than 50 LOC
  - It has just 2 API methods (and one of them supposed to be called just once)
  - You'll need just a minute to master enso
* It's universal and works both in Node.js and a browser

## Examples

### Master Enso in a Minute

Here is a simplified example of timer application which renders
how many seconds passed:

```js
var enso = require('enso')

// We'll need just these two functions:
var loop = enso.loop
var put = enso.put

// State of application supposed to be kept in one place. It could be an object,
// immutable map or just a number like in the example.
//
// Our timers starts with 0:
var initialState = 0

// Pass view render function to loop, and get state every time
// when it's changing:
loop(initialState, function(state, prevState) {
  // We are getting two states: new and previous one so you can compare it,
  // save to persistant storage or just welcome a user like we do:
  if (prevState === null) {
    console.log('Hello, dear timer user!')
  }

  // Render application state
  console.log(state)
})

setInterval(function() {
  // Put function accepts a function (action) that change the state.
  // The action will be called immediately and then updated state
  // will go to our render loop:
  put(function(state) {
    // Return new state
    return state + 1
  })
}, 1000)
```

And that's it! Basically any type of application can be built using enso.

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

Actions:

```js
var put = require('enso').put

module.exports = {
  inc: function() {
    put(function(count) { return count + 1 })
  },

  dec: function() {
    put(function(count) { return count - 1 })
  }
}
```

Component:

```js
var React = require('react')
var actions = require('app/actions')

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
        <li><button onClick={actions.inc}>+</button></li>
        <li><button onClick={actions.dec}>-</button></li>
      </ul>
    </div>
  }
})

module.exports = Counter
```

### `requestAnimationFrame`

```js
var render = function(state, prevState) {
  window.requestAnimationFrame(function() {
    ReactDOM.render(
      <Counter count={count} />,
      document.getElementById('canvas')
    )
  })
}
```

### `waitFor` Implementation

```js
var put = require('enso').put

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
    .then(put)
}

function fetchUser(id, resolve) {
  resolve = resolve || put

  fetch(`/users/${id}`)
    .then(function(resp) { return resp.json() })
    .then(function(user) {
      resolve(function(state) {
        return state.setIn(['users', id], user)
      })
    })
}

function fetchSettings(_, resolve) {
  resolve = resolve || put

  fetch('/settings')
    .then(function(resp) { return resp.json() })
    .then(function(settings) {
      resolve(function(state) {
        return state.set('settings', settings)
      })
    })
}
```
