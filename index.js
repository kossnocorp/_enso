var ch = require('./src/ch')
var loop = require('./src/loop')

var actsCh = ch()

module.exports = {
  loop: loop.bind(null, actsCh.take),
  act: actsCh.act
}
