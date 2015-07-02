"use strict";

// common.js exports
var exps = module.exports = module;

exps.copy =
// shallow copy
function copy(a) {
  var b = Object.create(null);

  for(var p in a) {
    if (a.hasOwnProperty(p)) {
      b[p] = a[p];
    }
  }

  return b;
}

exps.objForEach =
// traverses own enumerable
function objForEach(obj, fn, that) {
  arguments[2] ? that = that : that = null;

  var keys = Object.keys(obj),
      exitNow = false;
  keys.every(function(el, ind, arr) {
    if (exitNow)
      return false;
    fn.call(that, obj[el], el, obj, exit);
    return true;
  }, null);

  function exit() {
    exitNow = true;
  }

  return undefined;
}
