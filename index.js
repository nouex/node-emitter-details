"use strict";

var EE = require("events");
var util = require("util");
var assert = require("assert");
var Details = require("./lib/details.js");

/**
* @api public
* @param {EventEmitter} emitter
* @return {EventEmitter} detailsObj
* Wraps the passed-in emitter, returning the stats object
*/

module.exports =
function getDetails(emitter, opts) {
  var opts = opts || {};
  assert.ok(emitter instanceof EE, "arg must be an Event Emitter");

  var details = new Details(emitter);

  emitter.on("newListener", onNewListener);
  emitter.on("removeListener", onRemoveListener);

  return details;

  function onNewListener(event, listener) {
    var eDetails;
    if (!(eDetails = details.getEventDetails(event))) {
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

}
