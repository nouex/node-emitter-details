"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  var countO = require("../../tot-tested.js");
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  countO.count++;
  debugCI("count: %d", countO.count);
}(process.env));

var ED = require("../../lib/event-details.js");
var assert = require("assert");

var ed = new ED(), ehD;

// now fill it in
ed._addHandler(dummyA);
ed._addHandler(dummyB);
ed._addHandler(dummyC);

// handlers
function dummyA() {

}

function dummyB() {

}

function dummyC() {

}

ehD = ed.getHandlerDetails(dummyB);

// just a couple of known props out the top of ma head
assert.notEqual(null, ehD.parent);
assert.ok ("arity" in ehD);
