import test from 'ava';
import argsert from './src/promise';

// NOTE: these examples use the promise API for coverage purposes only.

test('the arguments object can be passed in, spread', async t => {
  function foo () {
    return argsert('[string|number] <object>', ...arguments);
  }

  t.true(await foo('far', {}));
});

test('Function.prototype.apply with the arguments object', async t => {
  function foo () {
    return argsert.apply(null, arguments);
  }

  t.true(await foo('[string|number] <object>', 'bar', {}));
});

test('allows `this` to be the typeConfig string', async t => {
  function foo () {
    return argsert.apply('<null|object> [number]', arguments);
  }

  t.true(await foo({ bar: 'baz' }));
});

test('Function.prototype.call with the arguments object spread', t => {
  function foo () {
    return argsert.call('[number] <object>', ...arguments);
  }

  return t.throws(
    foo('bar', {}),
    /Invalid first argument. Expected number or undefined but received string./
  );
});

test('Function.prototype.bind using configurationString', t => {
  const foo = argsert.bind('[number]');

  return t.throws(
    foo({}),
    /Invalid first argument. Expected number or undefined but received object./
  );
});
