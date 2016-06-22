"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
  debug(
        "TOT_TESTED_FILES @",
        __filename.split(/\\|\//).pop(),
        "=",
        env.TOT_TESTED_FILES
      );
}(process.env));

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

// return
(function () {
  var e = createEmitter();
  var d = new Details(e);
  var e1 = Object.create(null);

  // HACK: registered event
  d.events["event1"] = e1;
  assert.strictEqual(d._addEvent("event1", []), e1);
  // non-registered event
  assert.ok(d._addEvent("event2", []));
})()
