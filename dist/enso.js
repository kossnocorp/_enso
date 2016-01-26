(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["enso"] = factory();
	else
		root["enso"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ch = __webpack_require__(1)
	var loop = __webpack_require__(2)
	
	var actsCh = ch()
	
	module.exports = {
	  loop: loop.bind(null, actsCh.take),
	  act: actsCh.act
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function(take, initialState, render, processor) {
	  function loopRender(state, prevState) {
	    try {
	      render(state, prevState)
	    } catch(err) {
	      setTimeout(function() { throw err })
	    }
	    renderLoop(state)
	  }
	
	  function renderLoop(state) {
	    take(function(acts) {
	      var nextState = acts.reduce(function(stateAcc, act) {
	        try {
	          var newState = act(stateAcc)
	          return processor ? processor(newState, stateAcc, act) : newState
	        } catch(err) {
	          setTimeout(function() { throw err })
	          return stateAcc
	        }
	      }, state)
	
	      loopRender(nextState, state)
	    })
	  }
	
	  loopRender(initialState, null)
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=enso.js.map