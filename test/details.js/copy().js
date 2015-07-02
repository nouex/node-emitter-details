"use strict";

var assert = require("assert");

function copy(a) {
  var b = Object.create(null);

  for(var p in a) {
    if (a.hasOwnProperty(p)) {
      b[p] = a[p];
    }
  }

  return b;
}

var a = {
  a1: "hello there",
  a2: {
    a2a: "subhello there"
  }
};

var acopy = copy(a);
// testing differentialness in objects
assert.notStrictEqual(acopy, a, "Must not be the same obj");
// testing shallow copiness
assert.strictEqual(acopy.a2, a.a2, "Must be the same obj prop");
