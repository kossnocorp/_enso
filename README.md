# Enso
[![Build Status](https://travis-ci.org/kossnocorp/enso.svg?branch=master)](https://travis-ci.org/kossnocorp/enso)

Minimal data flow loop for async applications.

## Installation

```npm
npm install enso --save
```

## Examples

### Basic Example

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
