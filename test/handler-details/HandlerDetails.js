"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  var countO = require("../../tot-tested.js");
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  countO.count++;
  debugCI("count: %d", countO.count);
}(process.env));

var HandlerDetails = require("../../lib/handler-details.js");
var assert = require("assert");

var dummy = function dummy(one, two) {
  // do nothing
}

var hd = new HandlerDetails(dummy);

// arity prop
assert.equal(typeof hd.arity, "number");
assert.equal(hd.arity, 2)

// stackTrace prop, not defined != hd.prevStackTrace
assert.equal(true, "prevStackTrace" in hd);

// parent prop, set to null as default
assert.strictEqual(null, hd.parent);
