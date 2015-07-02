"use strict";

var EventDetails = require("../../lib/event-details.js");

var hd = new EventDetails();

function dummy() {

}

console.log("before:\n", hd);
hd._addHandler(dummy)
console.log("\nafter:\n", hd);
