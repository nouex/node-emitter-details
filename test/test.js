"use strict";
// TODO use spawn() (async)

var fs = require("fs");

if (process.env.TESTING === "true") ; // skip
else {
  process.env.TESTING = "true";

  // FIXME this is a bad comparison since you are using the same function to
  // count files of acutal/expected
  console.log(
    "\n(%d of %d) tests ran",
    countFilesDeep(__dirname, test),
    countFilesDeep(__dirname)
  );
}

function test(path) {
  var spawnSync = require("child_process").spawnSync,
      child;

  console.log("running test: %s", path.split(/\\|\//).pop());
  child = spawnSync("node", [path]);
  child.stdout.length ? process.stdout.write(child.stdout, "buffer"): void(0);
  child.stderr.length ? process.stdout.write(child.stderr, "buffer") : void(0);
}

// FIXME should this be part of helpers
function countFilesDeep (dir, fn) {
  var conts = fs.readdirSync(dir), tot = 0;

  conts.forEach(function (item) {
    item = fullPath(dir, item);
    if (fs.statSync(item).isDirectory()) {
        tot += countFilesDeep(item, fn);
      } else {
        tot += 1;
        if (fn) fn(item);
      }
   }, null);

   return tot;

  function fullPath(dir, file) {
    var path = require("path");

    return dir + path.sep + file;
  }
 }
