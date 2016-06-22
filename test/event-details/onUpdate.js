"use strict";

(function (env) {
  if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) return;
  env.TOT_TESTED_FILES = Number(env.TOT_TESTED_FILES) +1;
}(process.env));

var getDetails = require("../../");
var assert = require("assert");

// test asyn EventDetails.prototype.onUpdate()
(function () {
  var e, emD, ev1D, asyncEv1D, done = false;

    process.on("exit", function () {
      assert.ok(done);
    });

    e = createEmitter();
    emD = getDetails(e);

    e.on("event1", function noop () {});
    ev1D = emD.getEventDetails("event1");
    emD.getEventDetails("event1").onUpdate(function () {
      assert.equal(arguments.length, 1, "unexpected args");
      asyncEv1D = arguments[0];
      assert.strictEqual(ev1D, asyncEv1D);
      done = true;
    });
    e.emit("event1");
})();

function createEmitter () {
  var E = require("events");
  return new E(Object.create(null));
}
