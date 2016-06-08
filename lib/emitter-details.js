"use strict";

// deps
var EventDetails = require("./event-details.js");
var helpers = require("./helpers.js");
var util = require("util");

// main class
var Details;
module.exports = module = Details =
function Details(cxt) {
  if (!(this instanceof Details)) return new Details(cxt);
  this.emitter = cxt
  this.events = Object.create(null);
  this.emittedEvents = [];
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
  // TODO assert string
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
    // TODO debug and throw error since it isn't a public api
  }
  
  var hd;
  // checking existence
  if (this.getEventDetails(eName) === null) {
    hd = this.events[eName] = new EventDetails();
    hd.parent = this;
    handlers.forEach(hd._addHandler, hd);
    return true;
  }

  return false;
};
