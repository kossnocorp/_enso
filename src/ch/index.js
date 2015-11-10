const EventEmitter = require('events')

module.exports = function () {
  const dispatcher = new EventEmitter()
  const actionsQueue = []

  return {
    take() {
      return new Promise((resolve, reject) => {
        dispatcher.once('put', () => {
          resolve(actionsQueue.slice(0))
          actionsQueue.length = 0
        })
      })
    },

    put(action) {
      actionsQueue.push.apply(actionsQueue, [].concat(action))
      setImmediate(() => {
        dispatcher.emit('put')
      })
    }
  }
}
