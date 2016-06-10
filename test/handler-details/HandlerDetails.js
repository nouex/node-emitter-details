"use strict";

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
