"use strict";
var EE = require("events");
var util = require("util");
var getDetails = require("../../index.js");
var assert = require("assert");
var opts = {
  saveInactiveEventDetails: true
}

function createEmitter() {
  util.inherits(Class, EE);
  function Class() {
    EE.call(this);
  }
  return new Class
}

var e1 = createEmitter();
var d1 = getDetails(e1, opts);

assert(e1.listeners("newListener").some(function(fn) {
  if (fn.name === "onNewListener" && fn.length === 2) {
    return true;
  }
}), "onNewListener not found");

assert(e1.listeners("removeListener").some(function(fn) {
  if (fn.name === "onRemoveListener" && fn.length === 2) {
    return true;
  }
}), "onRemoveListener not found");

// testing onNewListener
function event1Dummy1() {console.log("EMITTED:  event1")}
function event1Dummy2(a, b) {}
function event2Dummy1() {}
// registering events
e1.on("event1", event1Dummy1);
e1.on("event1", event1Dummy2);
e1.on("event2", event2Dummy1);
// emitting events
e1.emit("event1");
e1.emit("event1");
// removing events
e1.removeListener("event1", event1Dummy1);
e1.removeListener("event1", event1Dummy2);

process.stdout.write(util.inspect(d1, {colors: true, depth: null}))
