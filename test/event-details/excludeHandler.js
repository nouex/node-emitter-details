"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  var countO = require("../../tot-tested.js");
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  countO.count++;
  debugCI("count: %d", countO.count);
}(process.env));

var main = require("../../");
var emitter = new (require("events"))();
var assert = require("assert");

var emitterDetails = main(emitter, {
  excludedHandlers: [handlerOne]
}), eventDetails, success = false;

emitter.on("event1", handlerThree);
emitter.on("event1", handlerTwo);
emitter.on("event1", handlerOne);
assert(eventDetails = emitterDetails.getEventDetails("event1"));
assert.notStrictEqual(eventDetails.getHandlerDetails(handlerThree), null);
assert.strictEqual(eventDetails.excludeHandler(handlerThree), eventDetails);
emitter.emit("event1");

process.on("exit", function () {
  assert(success);
});

assert.strictEqual(eventDetails.getHandlerDetails(handlerOne), null);
assert.strictEqual(eventDetails.getHandlerDetails(handlerThree), null);

function handlerOne () {}
function handlerTwo () {success = true;}
function handlerThree() {}
