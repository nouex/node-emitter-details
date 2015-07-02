"use strict";

var util = require("util");
var assert = require("assert");

module.exports =
function HandlerDetails(fn) {
  assert(util.isFunction(fn), "arg must be a function");
  this.timesCalled = -1;
  this.prevArgs = null;
  this.arity = fn.length;
}
