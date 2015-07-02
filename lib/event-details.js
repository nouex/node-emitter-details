"use strict";
// deps
var HandlerDetails = require("./handler-details.js");
var common = require("./common.js");
var assert = require("assert");

module.exports = EventDetails;// FIXME as an function expression does not work
function EventDetails() {
  this.listeners = [];
  this.timesEmitted = 0;
  this.dateCreated = +(new Date());
}

EventDetails.prototype.getHandlerDetails = function(fn) {
  var handlerDetails = null;
  var listeners = this.listeners;

  common.objForEach(listeners, iterator, null);

  function iterator(el, ind, obj, exit) {
    if (el[0] === fn) {
      handlerDetails = el[1];
      exit();
    }
  }

  return handlerDetails;
};

EventDetails.prototype.getHandlers = function() {
  var handlers = this.listeners;
  var collection = new Array(handlers.length);

  common.objForEach(handlers, iterator, null);

  function iterator(el, ind, obj, exit) {
    collection[ind] = (el[0]);
  }

  return collection;
};

EventDetails.prototype.getHandlersDetails = function() {
  var listeners = this.listeners;
  var collection = new Array(listeners.length);

  common.objForEach(listeners, iterator, null);

  function iterator(el, ind, obj, exit) {
    collection[ind] = el[1];
  }

  return collection;
};

EventDetails.prototype._addHandler = function(fn) {
  assert(typeof fn === "function", "bad arg type");
  this.listeners.push([fn, new HandlerDetails(fn)]);
};

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
    // debug(//...)
  }

  ners.splice(index, 1);

  return;
};
