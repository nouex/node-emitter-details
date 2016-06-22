"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
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
