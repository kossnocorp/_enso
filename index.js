var ch = require('./src/ch')
var loop = require('./src/loop')

var actionsCh = ch()

module.exports = {
  loop: function(initialState, render, rescue) {
    loop(ch, initialState, render, rescue)
  },

  put: actionsCh.put
}
