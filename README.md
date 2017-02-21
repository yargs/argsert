# argsert [![Build Status](https://travis-ci.org/JaKXz/argsert.svg?branch=master)](https://travis-ci.org/JaKXz/argsert) [![Coverage Status](https://coveralls.io/repos/github/JaKXz/argsert/badge.svg?branch=master)](https://coveralls.io/github/JaKXz/argsert?branch=master)
> an argument validator [originally] for [`yargs`](https://github.com/yargs/yargs)

## API

```js
import argsert from 'argsert'

let passed

try {
  passed = argsert([configurationString], arguments)
} catch (err) {
  if (err instanceof TypeError) {
    // a type was missing or incorrectly given
  } else {
    // otherwise, there was something wrong with the configuration
    // or the number of args passed in.
  }
}
```

### Promise API

```js
import argsertPromise from 'argsert/promise'

argsertPromise([configurationString], arguments)
  .then((passed) => passed)
  .catch((err) => {
    // same error as above
  })
```

## Available Types

- [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
- [`buffer`](http://devdocs.io/node~4_lts/buffer#buffer_class_buffer)
- [`error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [`function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- [`null`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/null)
- [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [`object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `promise` [[that passes then/is-promise]](https://github.com/then/is-promise/blob/ed0eaa4dec17597f0dae892a0472a9b7f459320d/index.js#L3-L5)
- [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [`symbol`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [`undefined`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined)

### `*` wildcard:

allows for any type.

## Configuration via `configurationString`

space-separated entries with the following syntax:

### `[optional arguments]`:

`'[string|number] [object]'`:
- the first argument can be a string OR a number, or undefined
- the second argument can be an object literal, or undefined.

### `<required arguments>`:

`<object> <*>`:
- the first argument *must* be an object literal
- the second argument can be any type, but *must* be provided.

## Live Example

The following leverages `argsert` best because it is the most performant and easiest to read by:

### setting `argsert`'s `this` to the `configurationString`

```js
function nodeStyleCallback (err, result) {
  // ...
  argsert.apply('<error|undefined|null> [object|string]', arguments)
  // ...
}
```

You can also look at [the tests](https://github.com/JaKXz/argsert/blob/master/test.js#L133) for other ways to invoke `argsert`.
To learn more you can read about JS' functional-function methods: [`apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply), [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), and [`call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).
