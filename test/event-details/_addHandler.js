"use strict";

var EventDetails = require("../../lib/event-details.js");
var assert = require("assert");

var ed = new EventDetails();
var dummy = function dummy() {

};

ed._addHandler(dummy);

assert.ok(ed.listeners[0] instanceof Array);
assert.strictEqual(ed.listeners[0][0], dummy);
