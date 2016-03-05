"use strict";

var util = require("util");
var assert = require("assert");

module.exports =
function HandlerDetails(fn) {
  assert(util.isFunction(fn), "arg must be a function");
  this.arity = fn.length;
  this.prevStackTrace = null;
  this._parent = null;
}
