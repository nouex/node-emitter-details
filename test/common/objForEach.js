"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
}(process.env));

var oFE = require("../../lib/helpers.js").objForEach;
var assert = require("assert");

var subject = {
  "a": [],
  "b": "banana",
  "c": 144,
  "d": {
    "aa": "double a"
  }
}, counter = 0;

function iter(el, ind, obj) {
  var keys = Object.keys(subject);

  // Because oFE() traverses in the order of `Object.keys()`, and the result's
  // order is not to be relied on, this here is bad practice.  But anyways.

  // assert key
  assert.equal(ind, keys[counter]);
  // assert element `===`
  assert.strictEqual(el, subject[keys[counter++]]);
};

// test
oFE(subject, iter, null);
