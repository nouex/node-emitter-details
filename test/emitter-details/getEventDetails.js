"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  var countO = require("../../tot-tested.js");
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  countO.count++;
  debugCI("count: %d", countO.count);
}(process.env));

var Details = require("../../lib/emitter-details.js");
var assert = require("assert");

var objA = {};
var objB = {};

var det = new Details();
det.events = Object.create(null);
det.events.a = objA
det.events.b = objB;

assert.notEqual(det.getEventDetails("a"), null);
