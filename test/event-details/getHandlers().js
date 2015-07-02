"use strict";

var ED = require("../../lib/event-details.js");

var ed = new ED();
// log the blank instance
console.log(ed);
// now fill it in
ed._addHandler(dummyA);
ed._addHandler(dummyB);
ed._addHandler(dummyC);
// log packed ed
console.log(ed);
console.log("\n\n")
// finally use the examined function
console.log(ed.getHandlers());
// handlers
function dummyA() {

}

function dummyB() {

}

function dummyC() {

}
