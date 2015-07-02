"use strict";

var oFE = require("../../lib/common.js").objForEach;

var subject = {
  "a": [],
  "b": "banana",
  "c": 144,
  "d": {
    "aa": "double a"
  }
};

oFE(subject, iter, null);

function iter(el, ind, obj) {
  console.log("el:  ", el, "\n", "ind:  ", ind, "\n", "obj: ", obj, "\n\n");
};
