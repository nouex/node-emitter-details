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
  // TODO use a regexp related meth to strip /$Error\n/
  return stack.slice(6, stack.length);
}

Error.prepareStackTrace = function (err, arr) {
  // curr CallSite object
  return arr[0];
};
