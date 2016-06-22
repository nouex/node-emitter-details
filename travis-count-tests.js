"use strict";
/**
  * This is meant for Travis-CI, since we can't run test.bat and we rely on
  * listing all the test files in .travis.yml we must provide a way to check
  * that we never forget adding a newly-created file in test/ to the list in
  * .travis.yml
  *
  * TODO in the future this could all be fixed by having a single node script
  * recurse *and* execute all test files
  */

var path = require("path");
var assert = require("assert");

if (!(process.env.CI === "true" && process.env.TRAVIS === "true")) {
  process.stdout.write(
    "detected non Travis-CI env, skipping " + __filename.split(/\/|\\/).pop(),
    "utf8"
  );
  process.exit(0);
}

var fs = require("fs");
var path = require("path");

var expect, actual;

expect = countFilesDeep(__dirname, __dirname);
actual = +process.env.TOT_TESTED_FILES;
if (isNaN(actual)) throw new Error("TOT_TESTED_FILES not set");
console.log("%d/%d tests ran", actual, expect);
assert.equal(
              expect,
              actual,
              "most likely forgot to plus TOT_TESTED_FILES in a test file"
            );

function countFilesDeep (dir, currDir) {
  var conts = fs.readdirSync(dir), tot = 0;

  conts.forEach(function (item) {
    item = currDir + path.sep + item;
    fs.statSync(item).isDirectory() ? tot += countFilesDeep(item, item) : tot += 1;
  }, null);

  return tot;
}
