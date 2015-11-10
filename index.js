const ch = require('./src/ch')
const loop = require('./src/loop')

const actionsCh = ch()

module.exports = {
  loop(initialState, render, rescue) {
    loop(ch, render, rescue)
  },

  put: actionsCh.put
}
