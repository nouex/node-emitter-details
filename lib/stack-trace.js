"use strict";

/**
* Implements stack trace api (https://github.com/v8/v8/wiki/Stack%20Trace%20API)
* to mainly get access to call site objects.
*/

module.exports = function getCallSite (exclude, ind) {
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
};
