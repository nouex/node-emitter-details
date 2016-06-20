"use strict";

// deps
var EventDetails = require("./event-details.js");
var helpers = require("./helpers.js");
var util = require("util");
var assert = require("assert");

// main class
var Details;
module.exports = module = Details =
function Details(cxt) {
  if (!(this instanceof Details)) return new Details(cxt);
  this.emitter = cxt
  this.events = Object.create(null);
  this.emittedEvents = [];
  this.opts = null;
}

/**
  * @api public
  * @return {Array} events
*/
Details.prototype.getEventNames = function() {
  return Object.keys(this.events);
}

/**
* @api public
* @param {string} eName
* @return {object|null}
*/
Details.prototype.getEventDetails = function (eName) {
  assert(util.isString(eName));

  var events = this.events, eventDetails = null;

  helpers.objForEach(events, iterator, null);

  return eventDetails;

  function iterator(el, ind, obj, exit) {
    if (ind === eName) {
      eventDetails = el;
      exit();
    }
  }
}

/**
* @api private
* @param {string} eName
* @param {fn|array} handlers single or array of handlers
* @return {boolean} returns true on success
*/
Details.prototype._addEvent = function(eName, handlers) {
  if (util.isFunction(handlers)) {
    handlers = [handlers]
  } else if (!util.isArray(handlers)) {
    throw new AssertionError({
      message: "Unsupported arg type: " + typeof handlers
    });
  }

  var hd;
  // checking existence
  if ((hd = this.getEventDetails(eName)) === null) {
    hd = this.events[eName] = new EventDetails();
    hd.parent = this;
    handlers.forEach(hd._addHandler, hd);
    return hd;
  }

  return hd;
};

/**
  * @api private
  * @param {String} eName Event name
  * @return {Undefined}
  */
Details.prototype._removeEvent = function (eName) {
  if (eName in this.events)
  delete this.events[eName];
};

/**
  * @api public
  * @param {String} eName Event name
  * @return {Object} Returns EmitterDetails inst for chaining
  */
Details.prototype.excludeEvent = function (eName) {
  this.opts.excludedEvents.push(eName);
  if (eName in this.events) this._removeEvent(eName);
  return this;
};
