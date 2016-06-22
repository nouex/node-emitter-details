"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
  debug(
        "TOT_TESTED_FILES @",
        __filename.split(/\\|\//).pop(),
        "=",
        env.TOT_TESTED_FILES
      );
}(process.env));

var main = require("../../");
var assert = require("assert");

var em = new (require("events"));
var emD = main(em);

assert.strictEqual(emD.excludeEvent("event2"), emD);
em.on("event1", Object.getPrototypeOf(Function));
em.on("event2", Object.getPrototypeOf(Function));
em.on("event3", Object.getPrototypeOf(Function));
assert(emD.getEventDetails("event3"));
emD.excludeEvent("event3");
assert.strictEqual(null, emD.getEventDetails("event3"));
assert.notStrictEqual(null, emD.getEventDetails("event1"));
assert.strictEqual(null, emD.getEventDetails("event2"));
