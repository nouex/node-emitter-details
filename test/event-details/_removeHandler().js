"use strict";

var ED = require("../../lib/event-details.js");

var ed = new ED();
ed._addHandler(dummyA);
ed._addHandler(dummyB);
ed._addHandler(dummyC);
// log packed ed
console.log(ed);
console.log("\n\n")
// finally use the examined function
ed._removeHandler(dummyB)
console.log(ed);
// handlers
function dummyA() {

}

function dummyB() {

}

function dummyC() {

}
