"use strict";
var util = require("util");
var EE = require("events");

var emitterDetails = require("../");

util.inherits(E, EE);
function E() {
  EE.call(this);
}

var e = new E;
e.on("event1", function(){
  console.log("event1 fired now");
});

var eD = emitterDetails(e);
var event1D = eD.getEventDetails("event1");
e.emit("event1");

/*  ----- usage ----- */
console.log ("Specs for '" + event1D.name + "':\n\n");
console.log ("times called: " + event1D.timesEmitted + "\n");
// bit of a HACK, could have used `getHandlerDetails()`
console.log ("stack trace:" + event1D.listeners[0][1].prevStackTrace + "\n");
