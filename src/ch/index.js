var EventEmitter = require('events')

module.exports = function() {
  var dispatcher = new EventEmitter()
  var actionsQueue = []

  return {
    take: function() {
      return new Promise(function(resolve, reject) {
        dispatcher.once('put', function() {
          resolve(actionsQueue.slice(0))
          actionsQueue.length = 0
        })
      })
    },

    put: function(action) {
      actionsQueue.push.apply(actionsQueue, [].concat(action))
      setTimeout(function() {
        dispatcher.emit('put')
      }, 0)
    }
  }
}
