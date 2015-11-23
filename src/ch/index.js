module.exports = function() {
  var actCb
  var actsQueue = []

  function callCb() {
    actCb && actCb()
  }

  return {
    take: function(cb) {
      actCb = function() {
        var acts = actsQueue.slice(0)
        actsQueue.length = 0
        actCb = null
        cb(acts)
      }

      if (actsQueue.length > 0) callCb()
    },

    act: function(act) {
      actsQueue.push.apply(actsQueue, [].concat(act))
      callCb()
    }
  }
}
