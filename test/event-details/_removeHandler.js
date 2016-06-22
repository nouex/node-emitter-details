"use strict";

var debugCI = require("debug")("travis-count-tests");

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
  debugCI(
        "TOT_TESTED_FILES @",
        __filename.split(/\\|\//).pop(),
        "=",
        env.TOT_TESTED_FILES
      );
}(process.env));

var ED = require("../../lib/event-details.js");
var assert = require("assert");

var ed = new ED();
ed._addHandler(dummyA);
ed._addHandler(dummyB);
ed._addHandler(dummyC);

// handlers
function dummyA() {}

function dummyB() {}

function dummyC() {}

// assert known state
assert.equal(ed.listeners.length, 3);

// remove 'dummyB()' and return should be it
var ret = ed._removeHandler(dummyB);
assert(ed.listeners.length, 2);
assert.strictEqual(ret, dummyB);
