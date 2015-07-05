"use strict";

var util = require("util");
var assert = require("assert");

module.exports =
function HandlerDetails(fn) {
  assert(util.isFunction(fn), "arg must be a function");
  this.arity = fn.length;
  this.__defineGetter__("stackTrace", function () {
    return this.parent._stackTrace;
  });
}
