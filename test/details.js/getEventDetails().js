"use strict";

var Details = require("../../lib/details.js");

var objA = {};
var objB = {};

var det = new Details();
det.events.a = objA
det.events.b = objB;

console.log(det);
console.log("\n\n");
console.log(det.getEventDetails("b") === objB);
