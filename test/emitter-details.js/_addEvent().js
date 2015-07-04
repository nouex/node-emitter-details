"use strict";

var Details = require("../../lib/event-details.js");
var EE = require("events");
var util = require("util");

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
console.log(details1);

details1._addEvent("sampleE", function dummy1() {});
console.log(details1);
console.log(details1.events.sampleE.listeners)
