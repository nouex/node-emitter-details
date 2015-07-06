"use strict";
var util = require("util");
var EE = require("events");
var tool = require("../../tools");
var emitterDetails = require("../");

function testee(emitter, event) {
  var emD = emitterDetails(emitter);
  var res = tool.callSiteInfo(emD._callSite);
  return re;
}

/*  ----- usage ----- */
util.inherits(E, EE);
function E() {
  EE.call(this);
}

var e = new E;
e.on("event1", function(){
  console.log("event1 fired now");
});

var emD = emitterDetails(e);
var evD = emD.getEventDetails("event1");
e.emit("event1");
tool.logExit(evD.getEmissionCxt() === e);
