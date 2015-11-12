var ch = require('./src/ch')
var loop = require('./src/loop')

var actionsCh = ch()

module.exports = {
  loop: loop.bind(null, actionsCh),
  put: actionsCh.put
}
