"use strict";

var EE = require("events");
var util = require("util");
var assert = require("assert");
var EmitterDetails = require("./lib/emitter-details.js");
var EventDetails = require("./lib/event-details.js");
var HandlerDetails = require("./lib/handler-details.js");
var common = require("./lib/common.js");
var getCallSite = require("./lib/stack-trace.js");

/**
* @api public
* @param {EventEmitter} emitter
* @return {Object} emitterDetails
* Wraps the passed-in emitter, returning the stats object
*/
var exp = module.exports =
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
      handlers = util.isArray(event) ? event : [event];
      handlers.forEach(function(fn) {
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
      // for async i think
      evDetails.genericEventRegulator = genericEventRegulator;
      evDetails.name = event;
      if (!(event === "newListener" || event === "removeListener"))
        emitter.on(event, genericEventRegulator);
    } else {
      // TODO make sure genericEventRegulator is set i.e. debug(...)
      evDetails._addHandler(listener);
    }
    // make genericEventRegulator an emitter, this is for
    // async getEmissionCxt to listen on & maybe future add-ons
    var helper;
    // FIXME why __proto__ x2
    genericEventRegulator.__proto__.__proto__ = EE.prototype;
    function Helper() {
      EE.call(this);
    }
    Object.getOwnPropertyNames(helper = new Helper).forEach(function(prop) {
      genericEventRegulator[prop] = helper[prop];
    });
    helper = null;

    function genericEventRegulator() {
      var stackTrace, err = new Error,
          callSite = getCallSite(genericEventRegulator, 0);

      // update events of emitter
      if (!~emitterDetails.emittedEvents.indexOf(event)) {
        emitterDetails.emittedEvents.push(event);
      }

      evDetails.timesEmitted++;
      evDetails.prevArgs = common.copy(arguments);
      // use the call site to get cxt
      evDetails.calledCxt = callSite.getThis() || callSite.getTypeName();
      // capturing stack trace
      Error.captureStackTrace(err, genericEventRegulator);
      stackTrace = err.stack.slice(6, err.stack.length);
      // update 'prevStackTrace' on all listeners
      evDetails.listeners.forEach(function (handler) {
        var hdlrDetails = handler[1];
        hdlrDetails.prevStackTrace = stackTrace;
      }, null);
      // after updating, emit itself and pass in eventDetails for async
      genericEventRegulator.emit(event, evDetails);
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

// useful for a long ancestry such as an http socket
// NOTE was my inspiration for the project
// tryes sync then async
// TODO avoid tracking onEvent as a listener ( it is not a user listener)
// TODO use evDetails.getEmissionCxtAsync insitead of registering a func
exp.cxtOfEmission = function(emitter, event, fn) {
  var emDetails = exp(emitter);
  emitter.on(event, onEvent);
  function onEvent() {
    // event emitted so for sure there will be event details
    fn(emDetails.getEventDetails(event).getEmissionCxt());
  }
}
