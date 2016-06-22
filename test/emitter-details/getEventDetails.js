"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  require("../../tot-tested.js").count++;
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
