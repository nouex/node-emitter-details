"use strict";

var HandlerDetails = require("../../lib/handler-details.js");

function dummy(one, two) {
  // do nothing
}

var hd = new HandlerDetails(dummy);
console.log(hd);
