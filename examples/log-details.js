"use strict";

var util = require("util");
var getDetails = require("../");
var noop = function noop () {};
var put = function () {
  process.stdout.write.call(process.stdout, arguments[0]);
};

var e = new (require("events"))();
e.on("action", function onAction (){});
var d = getDetails(e, {excludedEvents: ["newListener", "removeListener"]});
e.emit("action", "apple", "kills", "aman");


put(util.inspect(d, {
      colors: true,
      depth: 4
    }));
