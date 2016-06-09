"use strict";

// imports
var getCallSite = require("../lib/stack-trace.js");
var assert = require("assert");

// a few props that identify a call site obj
var callSiteProps = [
  "getThis",
  "getTypeName",
  "getFunction",
  "getFunctionName",
  "getLineNumber"
], cs;

function a() {
  b()
  function b() {
    c()
    function c() {
      d()
      function d() {
        cs = getCallSite (null, 0);
      }
    }
  }
}

a();
// assert that it's a call site object
callSiteProps.forEach(function (name) {
  assert.strictEqual(true, name in cs);
}, null);
