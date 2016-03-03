## ./

* ~~Add a README.md~~
* Add .travis-ci

## @lib/handler-details.js

* Add stack trace property that captures the stack trace on invocation of handler

* Use a preferable function in place of Error.prepareStackTrace to return a simple
  string

## @lib/event-details.js

* Add a _removeEvent() api, as used within @index.js:onRemoveListener to
  eventDetails obj

* Make `eventDetails` have a `name` property for the event name.
