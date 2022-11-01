## 2.x

### 2.0.0

* update postal
* update debug dep. sorry, had to do some silly stuff to make existing tests work.
* update patch and minor deps
* Update dev deps
* Remove unused deps
* update node

## 1.x

### 1.0.0

* Update to latest eslint leankit config
* Respond to pr review items
* Fix eslint errors in specs
* Remove unused npm script
* Update lodash, machina, moment, debug, & mocha
* Switch to node 12.18, npm scripts, nyc, eslint, and remove when

## 0.3.x

## 0.3.3
 * Move postal from devDependencies to dependencies

## 0.3.2
 * Use "" as default namespace
 * Use correct console calls for stdOut adapter
 * Add alternate api to whistelpunk

## 0.3.1
 * Fix bug in loading adapters from relative paths

### 0.3.0
 * Add support for topic based filtering on adapters
 * Support multiple subscription topics for adapters
 * Calling reset on a log should only affect adapter subscriptions that match the log's namespace
 * Provide consistent default timestamp using GMZ timezone in ISO
 * Add raw moment timestamp to data published to adapters
 * Add timestamp configuration to adapter configuration to allow users to customize format

## 0.2.x

### 0.2.1
 * Refactored Logger to accept an optional timestamp
 * Timestamp is now a Date object instead of a integer

### 0.2.0
 * Bug fix - log entries made before promise-based adapters resolved got lost
 * Re-design of how promise-based adapters work to support bug fix
 * More tests!

## 0.1.0
 * Bug fix - adapters got re-wired up causing duplicate messages
 * Introduced the ability to have logging adapters modules that returned promises
