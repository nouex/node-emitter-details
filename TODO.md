## ./

* ~~Add a README.md~~
* Add .travis-ci
* reaname lib/common.js to lib/helpers.js
* change _stackTrace
* next time, don't use a TODO like this, use pull request and issues on github to track them intead of this

## @./index.js

* If opts :: excludedEvents includes 'removeListener' or 'newListener'
  then those lines let you skip over two important functinos.  That should not
  be cause it's taking away the whole point of this project.  That's when alot
  of the specs/details are updated.

## @lib/handler-details.js

* Add stack trace property that captures the stack trace on invocation of handler

* Use a preferable function in place of Error.prepareStackTrace to return a simple
  string

## @lib/event-details.js

* Add a _removeEvent() api, as used within @index.js:onRemoveListener to
  eventDetails obj

* Make `eventDetails` have a `name` property for the event name.

* Use debug() within _removeHandler()

## @test

* Remove captureStackTrace.js from this repository into ../../snippets
* **add to 'test/index' a script where all options are tested (once there
  are more options to test obviously)**
* **add a section in 'test/index/main.js' to document and test all          properties that are updated outside of the constructor function's body,
  as of now it is mainly done in 'genericEventRegulator'**


## README.md

* Make a note about the defaults that it includes such as attaching listeners
  to the newListener and removeListener, and including genericEventRegulator
  as a listener to any event registered via node-emitter-details
