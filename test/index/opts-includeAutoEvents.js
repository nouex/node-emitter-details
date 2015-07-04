"use strict";

var EE = require("events");
var util = require("util");
var getDetails = require("../../index.js");
var assert = require("assert");
var opts = {
  saveInactiveEventDetails: true,
  includeAutoEvents: [false, false]
};

function createEmitter() {
  util.inherits(Class, EE);
  function Class() {
    EE.call(this);
  }
  return new Class
}

var e1 = createEmitter();
var d1 = getDetails(e1, opts);

// testing onNewListener
function event1Dummy1() {console.log("EMITTED:  event1")}
function event1Dummy2(a, b) {}
function event2Dummy1() {}
// registering events
e1.on("event1", event1Dummy1);
e1.on("event1", event1Dummy2);
e1.on("event2", event2Dummy1);
// removing events
//e1.removeListener("event1", event1Dummy1);
//e1.removeListener("event1", event1Dummy2);

e1.emit("event1", "hello", {"bar": "nothing"}, 4);

process.stdout.write(util.inspect(d1, {colors: true, depth: null}))
