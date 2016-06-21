"use strict";
/**
* Here we test the whole shebang.  Sinc it's alot, we're just gonna assert a
* couple of what-should-be-there's in all three levels of emitter, event, handler.
* Note that it excludes testing the async phases of the project.
*/

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
function event1Dummy1() {}
function event1Dummy2(a, b) {}
function event2Dummy1() {}
// registering events
e1.on("event1", event1Dummy1);
e1.on("event1", event1Dummy2);
e1.on("event2", event2Dummy1);
// assert the above
assert.ok("event1" in d1.events, "'event1' did not register");
assert.ok("event2" in d1.events, "'event2' did not register");
// date stamp should be there by now
assert.ok(d1.events.event1.dateCreated instanceof Date,
          "dateCreated stamp is not instanceof `Date`");
// parent should have been assigned by now
assert.notEqual(undefined, d1.events.event1.parent, "parent is null");
// genericEventRegulator has not been called so
assert.equal(
  null,
  d1.events.event1.getHandlerDetails(event1Dummy1).prevStackTrace,
  "`prevStackTrace` should be empty"
);
// emitting events
e1.emit("event1");
e1.emit("event1", "bon", "jour");
e1.emit("event2");
// assert the above
assert.equal(2, d1.events.event1.timesEmitted, "'timesEmitted' is off");
assert.equal("jour", d1.events.event1.prevArgs[1], "'prevArgs' is off");
assert.notEqual(undefined, d1.events.event1.listeners[0][1].prevStackTrace);
assert.deepEqual(["event1", "event2"], d1.emittedEvents);
// removing events
assert.equal(3, d1.events.event1.listeners.length);
e1.removeListener("event1", event1Dummy1);
// assert above
assert.equal(2, d1.events.event1.listeners.length);
// remove the last listener
e1.removeListener("event1", event1Dummy2);
// b/c opts:saveInactiveEventDetails is explicitly on in opts, we can assert
assert.ok(("event1" in d1.events));

/* The nex part of this test consists of checking that the options work */

// options :: saveInactiveEventDetails
(function () {
  // options :: saveInactiveEventDetails = <default>
  (function () {
    var e = createEmitter();
    var d = getDetails(e/*, use def opts*/);
    var event1dummy1;

    e.on("event1", event1dummy1 = function event1dummy1() {});
    // 1 plus the default: genericEventRegulator
    assert.equal(2, d.events.event1.listeners.length);
    // remove now
    e.removeListener("event1", event1dummy1);
    // now 'event1' should not exist
    assert(!("event1" in d.events));
  })();
    // options :: saveInactiveEventDetails = true
  (function () {
    var opts = {
      saveInactiveEventDetails: true
    };
    var e = createEmitter();
    var d = getDetails(e, opts);
    var event1dummy1 = function () {};

    e.on("event1", event1dummy1);
    assert.equal(2, d.events.event1.listeners.length);
    // remove
    e.removeListener("event1", event1dummy1);
    // now event1 should still exist
    assert("event1" in d.events);
  })();
})();

// options :: excludedEvents
(function () {
  var opts = {
    excludedEvents: [
      "event2", "event4"
    ]
  };
  var e = createEmitter();
  var d = getDetails(e, opts);
  var noop = function () {};

  e.addListener("event1", noop);
  e.addListener("event2", noop);
  e.addListener("event3", noop);
  e.addListener("event4", noop);

  assert.deepEqual(
    ["newListener", "removeListener", "event1", "event3"], Object.keys(d.events)
  );
}());

// trackEvent()
(function () {
  var e = new EE(), ev = "turn-on",
      evDetails;

  evDetails = getDetails.trackEvent(e, ev);
  // make sure its strictEqual and not a copy so we are assured that the stats
  // are updated live
  assert.strictEqual(evDetails, evDetails.parent.events[ev]);
})();
