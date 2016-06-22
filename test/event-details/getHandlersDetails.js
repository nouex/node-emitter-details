"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  require("../../tot-tested.js").count++;
}(process.env));

var ED = require("../../lib/event-details.js");
var assert = require("assert");

var ed = new ED();

// now fill it in
ed._addHandler(dummyA);
ed._addHandler(dummyB);
ed._addHandler(dummyC);

assert.equal(typeof ed.getHandlersDetails(), "object");

function dummyA() {

}

function dummyB() {

}

function dummyC() {

}
