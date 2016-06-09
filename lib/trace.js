"use strict";

/**
* Implements stack trace api (https://github.com/v8/v8/wiki/Stack%20Trace%20API)
* to mainly get access to call site objects.
*/

module.exports = {
  getCallSite: getCallSite,
  getStackTrace: getStackTrace
};


function getCallSite (exclude, ind) {
  var e = new Error, _prepareStackTrace = Error.prepareStackTrace,
      ret;

  if (exclude == null) exclude = getCallSite;

  Error.captureStackTrace(e, exclude);
  Error.prepareStackTrace = function (e, arr) {
    ret = arr[ind];
  };
  e.stack;
  Error.prepareStackTrace = _prepareStackTrace;

  return ret;
}

function getStackTrace (excludeFn) {
  excludeFn = typeof excludeFn === "function" ? excludeFn : getStackTrace;

  var err = new Error, stackTrace;

  Error.captureStackTrace(err, excludeFn);
  stackTrace = err.stack.slice(6, err.stack.length);

  return stackTrace;
}
