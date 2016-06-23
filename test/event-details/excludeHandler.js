"use strict";

var main = require("../../");
var emitter = new (require("events"))();
var assert = require("assert");

var emitterDetails = main(emitter, {
  excludeHandlers: [handlerOne]
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
