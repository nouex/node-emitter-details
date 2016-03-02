"use strict";

function a() {
  b()
  function b() {
    c()
    function c() {
      var e = new Error;
      d()
      function d() {
        Error.captureStackTrace(e);
        console.log(e.stack);
      }
    }
  }
}

function formatStack(stack) {
  var regex = /Error\n/;
  return stack.replace(regex, "");
}

Error.prepareStackTrace = function (err, arr) {
  // curr CallSite object
  return arr[0];
};
