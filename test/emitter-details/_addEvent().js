"use strict";

var Details = require("../../lib/emitter-details.js");
var EE = require("events");
var util = require("util");
var assert = require("assert");

// factory function
function createEmitter() {
  util.inherits(Class, EE);
  function Class() {
    EE.call(this);
  }

  return new Class();
}

var emitter1 = createEmitter();
var details1 = new Details(emitter1);
var eventDetails1;

details1._addEvent("sampleE", function dummy1() {});
assert.notEqual(undefined, eventDetails1 = details1.getEventDetails("sampleE"));
assert.equal(eventDetails1.listeners.length, 1);
