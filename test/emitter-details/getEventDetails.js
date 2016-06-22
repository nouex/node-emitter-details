"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
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
