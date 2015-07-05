"use strict";
// tests stages of index.js

var getEmitterDetails = require("../../index.js");
var util = require("util");
var assert = require("assert");
var EE = require("events");

function createEmitter() {
  var ret = new function() {
    EE.call(this)
  };

  ret.__proto__ = EE.prototype;

  return ret;
}

function event1handler1() {console.log("EVENT1HANLDER1 FIRED")};
function event1handler2(d1, d2) {console.log("EVENT1HANDLER2 FIRED")};
function event2handler1() {console.log("EVENT2HANDLER1 FIRED")};

function log(mess, iOpts) {
  process.stdout.write(util.inspect(mess, iOpts));
}

function logNExit(mess, code, iOpts) {
  code = util.isNumber(code) ? code : 0;
  log(mess, iOpts);
  process.exit(code);
}

function createCustomLogger(code, iOpts) {
  return function(mess) {
    logNExit(mess, code, iOpts);
  };
}
// full-depth, color logger
var log1 =
createCustomLogger(0, {depth: null, colors: true});

var opts = {
  excludedEvents: ["removeListener", "newListener"],
  saveInactiveEventDetails: true
}

/*  ----- EMITTER 1 ----- */
var e1 = createEmitter();                             // log1(e1);

/*  ----- EMITTER DETAILS ----- */
var d1 = getEmitterDetails(e1, opts);                 // log1(d1);

/*  ----- EMITTER ADD EVENTS  ----- */
e1.on("event1", event1handler1);                      // log1(d1);
e1.on("event1", event1handler2);
e1.on("event2", event2handler1);                      // log1(d1)

/*  ----- EMITTER FIRE EVENTS ----- */
e1.emit("event1", "dummyArg1", {"dummyArg2": 222});
e1.emit("event2");                                     // log1(d1)

/*  ----- STACK TRACE ----- */
                                                          log1(d1.events.event1.listeners[0][1].stackTrace)

/*  ----- EMITTER REMOVE EVENT ----- */
e1.removeListener("event1", event1handler2);           // log1(d1.events);
e1.removeListener("event1", event1handler1);           // log1(d1.events)
