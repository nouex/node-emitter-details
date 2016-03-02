"use strict";
// deps
var HandlerDetails = require("./handler-details.js");
var common = require("./common.js");
var assert = require("assert");
var util = require("util");

module.exports = EventDetails;// FIXME as an function expression does not work
function EventDetails() {
  this.listeners = [];
  this.timesEmitted = 0;
  this.dateCreated = new Date();
  this.prevArgs = null;
  this._stackTrace;
  this._callSite = null;
  this.parent = null;
  this.name = "";
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

  ners.splice(index, 1);

  return;
};

EventDetails.prototype.getEmissionCxt = function () {
  var _callSite = this._callSite,
      that;
  if (util.isNull(_callSite)) {
    //  no op
    return undefined;
  } else {
    that = _callSite.getThis();
    if (util.isObject(that)) {
      return that;
    } else {
      // unexpected TODO use debug(), throw for now
      throw new TypeError("unexpected result");
    }
  }
};

// FIXME test me and the genericEventRegulator's emissions used for this here
EventDetails.prototype.getEmissionCxtAsync = function (fn) {
  this.genericEventRegulator.on(this.name, handler);

  function handler(evDetails) {
    var _callSite = evDetails._callSite;
    // debug _callSite isn't null
    fn(_callSite.getThis());
  }
};
