"use strict";

var EE = require("events");
var util = require("util");
var assert = require("assert");
var EmitterDetails = require("./lib/emitter-details.js");
var common = require("./lib/common.js");

/**
* @api public
* @param {EventEmitter} emitter
* @return {Object} emitterDetails
* Wraps the passed-in emitter, returning the stats object
*/

module.exports =
function getEmitterDetails(emitter, opts) {

  /* ----- filter args ----- */

  (function normalizeOpts() {
    var exEvs, saveInactiveEventDetails;
    opts = util.isObject(opts) ? opts : Object.create(null);
    exEvs = opts.excludedEvents;
    opts.excludedEvents = util.isArray(exEvs) ? exEvs : util.isFunction(exEvs)
     ? /*FIXME assert.AssertionError("bad `excludedEvents`"),*/ exEvs = [exEvs] : exEvs = [];
     saveInactiveEventDetails = opts.saveInactiveEventDetails;
    opts.saveInactiveEventDetails = saveInactiveEventDetails ? true : false;
  }())

  assert.ok(emitter instanceof EE, "arg must be an Event Emitter");

  /* ----- main body: update emitter details & add crucial handlers ----- */

  var emitterDetails = new EmitterDetails(emitter);

  // update registered events to detailed events
  var _events = common.copy(emitter._events);
  var xEvents = opts.excludedEvents;
  // special case handlers are added now
  [["newListener", onNewListener], ["removeListener", onRemoveListener]].forEach(function(pair) {
    if (!~xEvents.indexOf(pair[0])) {
      onNewListener(pair[0], pair[1]);
    }
  });

  Object.keys(_events).forEach(function(name) {
    var handlers, event;
    if (!~xEvents.indexOf(name)) {
      event = _events[name];
      handler = util.isArray(event) ? event : [event];
      handler.forEach(function(fn) {
        onNewListener(name, fn);
      }, null);
    }
  }, null);
  _events = null;

  // NOTE must go in this order so `onRemoveListener` does not re-register
  emitter.on("removeListener", onRemoveListener);
  emitter.on("newListener", onNewListener);


  /* ----- return ----- */

  return emitterDetails;

  /* ----- func decls ----- */

  function onNewListener(event, listener) {
    var evDetails;

    if (~opts.excludedEvents.indexOf(event)) {
      return;
    }

    if (util.isNull(evDetails = emitterDetails.getEventDetails(event))) {
      emitterDetails._addEvent(event, listener);
      evDetails = emitterDetails.getEventDetails(event);
      if (!(event === "newListener" || event === "removeListener"))
        emitter.on(event, genericEventRegulator);
    } else {
      // TODO make sure genericEventRegulator is set i.e. debug(...)
      evDetails._addHandler(listener);
    }

    function genericEventRegulator() {
      evDetails.timesEmitted++;
      evDetails.prevArgs = common.copy(arguments);
    }
  }

  function onRemoveListener(event, listener) {
    var evDetails = emitterDetails.getEventDetails(event);
    if (evDetails === null)
      return;

    evDetails._removeHandler(listener);
    if (emitter.listeners(event).length === 1 && emitter.listeners(event)[0].name === "genericEventRegulator") {
      // FIXME emitter.removeListener(event, genericEventRegulator);
      /* FIXED */ emitter.removeAllListeners(event);
      if (!opts.saveInactiveEventDetails) {
        delete emitterDetails.events[event];
      }
    }
  }
}
