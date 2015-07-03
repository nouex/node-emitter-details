"use strict";

var EE = require("events");
var util = require("util");
var assert = require("assert");
var Details = require("./lib/details.js");
var common = require("./lib/common.js");

/**
* @api public
* @param {EventEmitter} emitter
* @return {EventEmitter} detailsObj
* Wraps the passed-in emitter, returning the stats object
*/

module.exports =
function getDetails(emitter, opts) {
  var doExit = null;
  var opts = opts || {};
  if (!(opts.includeAutoEvents || util.isArray(opts.includeAutoEvents))) {
    opts.includeAutoEvents = [false, false];
  } else if (util.isArray(opts.includeAutoEvents)) {
    assert.strictEqual(typeof opts.includeAutoEvents[0], "boolean", "`includeAutoEvents` el must be a boolean");
    assert.strictEqual(typeof opts.includeAutoEvents[1], "boolean", "`includeAutoEvents` el must be a boolean");
  }
  opts.saveInactiveEventDetails = opts.saveInactiveEventDetails ? opts.saveInactiveEventDetails : false;

  assert.ok(emitter instanceof EE, "arg must be an Event Emitter");

  var details = new Details(emitter);
  // NOTE the following line must go in this order
  emitter.on("newListener", onNewListener);
  emitter.on("removeListener", onRemoveListener);
  // transfer normal events to detailed events
  var _events = common.copy(emitter._events);
  var exEvents = util.isArray(opts.excludedEvents) ? opts.excludedEvents : [];
  opts.includeAutoEvents[0] ? void 0 : exEvents.push("newListener");
  opts.includeAutoEvents[1] ? void 0 : exEvents.push("removeListener");
  Object.keys(_events).forEach(function(name) {
    var exEventFound;
    if (!~exEvents.indexOf(name)) {
      var single = false;
      var count = util.isArray(_events[name]) ? _events[name].length : single = true;
      single ? count = 1 : count = count;
      for (var i = count; i; i--) {
        single ? onNewListener(name, _events[name]) : onNewListener(name, _events[name][Math.abs(i - count)])
      }
    }
  }, null);
  _events = null;

  return details;

  function onNewListener(event, listener) {
    var eDetails;
    if (!(eDetails = details.getEventDetails(event))) {
      // onRemoveListener with flag turned off
      if (util.isNull(doExit)) {
        opts.includeAutoEvents[1] === false ? doExit = true : doExit = false;
        if (opts.includeAutoEvents[0] === true) {
          onNewListener("newListener", onNewListener);
        }
        if (doExit)
          return;
      }
      details._addEvent(event, listener);
      eDetails = details.getEventDetails(event);
      if (!(event === "newListener" || event === "removeListener"))
        emitter.on(event, genericEventWrapper);
    } else {
      // TODO make sure genericEventRegulator is set i.e. debug(...)
      eDetails._addHandler(listener);
    }
    function genericEventWrapper() {
      genericEventRegulator.apply(null, [eDetails].concat(arguments));
    }
  }

  function onRemoveListener(event, listener) {
    // DEBUG make sure event event exists
    var eDetails = details.getEventDetails(event);
    if (eDetails === null)
      return false;//after last handler is removed and inactive eDetails is deleted
    eDetails._removeHandler(listener);
    if (emitter.listeners(event).length === 1 && emitter.listeners(event)[0] === genericEventWrapper) {
      if (!opts.saveInactiveEventDetails) {
        delete details.events[event];// FIXME does delete only work in prop form i.e. emitter.eDetails
      }
      emitter.removeListener(event, genericEventWrapper);
    }
  }

  function genericEventRegulator(eDetails) {
    var args = [].slice.call(arguments, 0, arguments.length);
    eDetails.timesEmitted++;
  }
}

// PROBE FIELD
var opts = {
  saveInactiveEventDetails: false,
  includeAutoEvents: [true, true],
  exludedEvents: ["ename", "ename2"]
};

// TODO
// it is messy, fix it
