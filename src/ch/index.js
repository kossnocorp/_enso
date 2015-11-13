module.exports = function() {
  var putCb
  var actionsQueue = []

  function callCb() {
    if (putCb) putCb()
  }

  return {
    take: function(cb) {
      putCb = function() {
        var actions = actionsQueue.slice(0)
        actionsQueue.length = 0
        putCb = null
        cb(actions)
      }

      if (actionsQueue.length > 0) callCb()
    },

    put: function(action, async) {
      actionsQueue.push.apply(actionsQueue, [].concat(action))

      if (async) {
        setTimeout(callCb, 0)
      } else {
        callCb()
      }
    }
  }
}
