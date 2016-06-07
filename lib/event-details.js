"use strict";
// deps
var HandlerDetails = require("./handler-details.js");
var helpers = require("./helpers.js");
var assert = require("assert");
var util = require("util");

// NOTE @ index.js adds the 'genericEventRegulator' property
module.exports = EventDetails;// FIXME as an function expression does not work
function EventDetails() {
  this.listeners = [];
  this.timesEmitted = 0;
  this.dateCreated = new Date();
  this.prevArgs = null;
  this.calledCxt = null;
  this.parent = null;
  this.name = "";
}

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

EventDetails.prototype.getHandlers = function() {
  var handlers = this.listeners;
  var collection = new Array(handlers.length);

  helpers.objForEach(handlers, iterator, null);

  function iterator(el, ind, obj, exit) {
    collection[ind] = (el[0]);
  }

  return collection;
};

EventDetails.prototype.getHandlersDetails = function() {
  var listeners = this.listeners;
  var collection = new Array(listeners.length);

  helpers.objForEach(listeners, iterator, null);

  function iterator(el, ind, obj, exit) {
    collection[ind] = el[1];
  }

  return collection;
};

EventDetails.prototype._addHandler = function(fn) {
  var hd;
  assert(typeof fn === "function", "bad arg type");
  this.listeners.push([fn, hd = new HandlerDetails(fn)]);
  hd.parent = this;
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

  return ners.splice(index, 1)[0][0];
};

// FIXME remove me before @ major release
EventDetails.prototype.getEmissionCxt = function () {
  var calledCxt = this.calledCxt;

  if (util.isNull(calledCxt)) {
    //  no op
    return undefined;
  } else {
    return calledCxt;
  }
};

EventDetails.prototype.onUpdate = function (fn) {
  this.genericEventRegulator.on(this.name, fn);
};

// FIXME test me and the genericEventRegulator's emissions used for this here
// FIXME remove me before next major release
EventDetails.prototype.getEmissionCxtAsync = function (fn) {
  this.onUpdate(handler);

  function handler(evDetails) {
    var calledCxt = evDetails.calledCxt;
    // debug calledCxt isn't null
    fn(calledCxt.getThis());
  }
};
