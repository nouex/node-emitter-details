"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  require("../../tot-tested.js").count++;
}(process.env));

var EventDetails = require("../../lib/event-details.js");
var assert = require("assert");

var ed = new EventDetails();
var dummy = function dummy() {

};

ed._addHandler(dummy);

assert.ok(ed.listeners[0] instanceof Array);
assert.strictEqual(ed.listeners[0][0], dummy);
