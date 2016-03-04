"use strict";

var Details = require("../../lib/emitter-details.js");
var assert = require("assert");

var objA = {};
var objB = {};

var det = new Details();
det.events = Object.create(null);
det.events.a = objA
det.events.b = objB;

assert.notEqual(det.getEventDetails("a"), null);
