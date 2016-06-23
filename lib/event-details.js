"use strict";
// deps
var HandlerDetails = require("./handler-details.js");
var helpers = require("./helpers.js");
var assert = require("assert");
var util = require("util");

// NOTE @index.js adds the '_onUpdate' property
module.exports = EventDetails;
function EventDetails() {
  this.listeners = [];
  this.timesEmitted = 0;
  this.dateCreated = new Date();
  this.prevArgs = null;
  this.parent = null;
  this.name = "";
}

/**
  * @api public
  * @param {Function} fn Handler to get details for.
  * @return {Object} handlerDetails
*/
EventDetails.prototype.getHandlerDetails = function(fn) {
  var handlerDetails = null;
  var listeners = this.listeners;

  helpers.objForEach(listeners, iterator, null);

  function iterator(el, ind, obj, exit) {
    if (el[0] === fn) {
      handlerDetails = el[1];
      exit();
    }
  }

  return handlerDetails;
};


/**
  * @api public
  * @return {Array} collection Shallow copy of array cointaining handlers.
*/
EventDetails.prototype.getHandlers = function() {
  var handlers = this.listeners;
  var collection = new Array(handlers.length);

  helpers.objForEach(handlers, iterator, null);

  function iterator(el, ind, obj, exit) {
    collection[ind] = (el[0]);
  }

  return collection;
};

/**
  * @api public
  * @return {Array} collection Shallow copy of array cointainig handlers details
*/
EventDetails.prototype.getHandlersDetails = function() {
  var listeners = this.listeners;
  var collection = new Array(listeners.length);

  helpers.objForEach(listeners, iterator, null);

  function iterator(el, ind, obj, exit) {
    collection[ind] = el[1];
  }

  return collection;
};

/**
  * @api private
  * @param {Fucntion} fn
  * @return {undefined}
*/
EventDetails.prototype._addHandler = function(fn) {
  var hd;
  assert(typeof fn === "function", "bad arg type");
  this.listeners.push([fn, hd = new HandlerDetails(fn)]);
  hd.parent = this;
};

/**
  * @api private
  * @param {Fucntion} fn
  * @return fn
*/
EventDetails.prototype._removeHandler = function(fn) {
  var ners = this.listeners,
      index = -1,
      nersLength = ners.length;
  // job is to find index if ever
  for (var i = 0; i < nersLength; i++) {
    if (ners[i][0] === fn) {
      index = i;
      break;
    }
  }

  if (!~index) {
    return undefined;
  }

  return ners.splice(index, 1)[0][0];
};

/**
  * @api public
  * @param {Function} fn Callback passed (eventDetails)
  * @return {undefined}
*/
EventDetails.prototype.onUpdate = function (fn) {
  this._onUpdate.on(this.name, fn);
};

/**
  * @api public
  * @param {Function} handler Function to exlcude
  * @return {Object} this instance of EventDetails
  */
EventDetails.prototype.excludeHandler = function (handler) {
  var self = this;
  // prevent adding it
  this.parent.opts.excludeHandlers.push(handler);
  // if already added, remove it
  helpers.objForEach(this.listeners, function (el, ind, arr, exit) {
    if (handler === el[0]) {
      self._removeHandler(handler);
      exit();
    }
  }, null);
  return this;
};
