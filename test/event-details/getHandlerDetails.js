"use strict";

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
