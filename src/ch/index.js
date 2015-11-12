module.exports = function() {
  var putCb
  var actionsQueue = []

  return {
    take: function() {
      return new Promise(function(resolve, reject) {
        putCb = function() {
          resolve(actionsQueue.slice(0))
          actionsQueue.length = 0
          putCb = null
        }
      })
    },

    put: function(action) {
      actionsQueue.push.apply(actionsQueue, [].concat(action))
      setTimeout(function() {
        if (putCb) putCb()
      }, 0)
    }
  }
}
