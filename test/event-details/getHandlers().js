"use strict";

var ED = require("../../lib/event-details.js");
var assert = require ("assert");

var ed = new ED();

ed._addHandler(dummyA);
ed._addHandler(dummyB);
ed._addHandler(dummyC);

var handlers = ed.getHandlers();

// in order as registered
assert.strictEqual(handlers[0], dummyA);
assert.strictEqual(handlers[1], dummyB);
assert.strictEqual(handlers[2], dummyC);

function dummyA() {

}

function dummyB() {

}

function dummyC() {

}
