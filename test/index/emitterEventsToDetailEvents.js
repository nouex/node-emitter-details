"use strict";
var EE = require("events");
var util = require("util");
var Details = require("../../index.js");

function event1Dummy1() {};
function event1Dummy2() {};
function event2Dummy1() {};

var emitter = new function() {
  EE.call(this);
  this.__proto__ = EE.prototype;
}

emitter.on("event1", event1Dummy1);
emitter.on("event1", event1Dummy2);
emitter.on("event2", event2Dummy1);

var opts = {
  includeAutoEvents: [false, false],
  saveInactiveEventDetails: false
};
var details = new Details(emitter, opts);

process.stdout.write(util.inspect(details.events, {"colors": true, "depth": null}));
