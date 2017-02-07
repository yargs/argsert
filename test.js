import test from 'ava';
import argsert from './';
import argsertPromise from './promise';

test('does not throw exception if optional argument is not provided', async t => {
  t.true(argsert('[object]'));
  t.true(await argsertPromise('[object]'));
});

test('throws exception if wrong type is provided for optional argument', t => {
  t.throws(
    () => argsert('[object|number]', 'hello'),
    /Invalid first argument. Expected object or number but received string./
  );

  t.throws(
    argsertPromise('[object|number]', 'hello'),
    /Invalid first argument. Expected object or number but received string./
  );
});

test('does not throw exception if optional argument is valid', t => {
  t.true(argsert('[object]', {foo: 'bar'}));
});

test('throws exception if required argument is not provided', t => {
  t.throws(
    () => argsert('<object>'),
    /Not enough arguments provided. Expected 1 but received 0./
  );
});

test('throws exception if required argument is of wrong type', t => {
  t.throws(
    () => argsert('<object>', 'bar'),
    /Invalid first argument. Expected object but received string./
  );
});

test('supports a combination of required and optional arguments', t => {
  t.true(argsert('<array> <string|object> [string|object]', [], 'foo', {}));
});

test('throws an exception if too many arguments are provided', t => {
  t.throws(
    () => argsert('<array> [batman]', [], 33, 99),
    /Too many arguments provided. Expected max 2 but received 3./
  );
});

test('allows for any type if * is provided', t => {
  t.true(argsert('<*>', 'bar'));
});

test('should ignore trailing undefined values', t => {
  t.true(argsert('<*>', 'bar', undefined, undefined));
});

test('should not ignore undefined values that are not trailing', t => {
  t.throws(
    () => argsert('<*>', 'bar', undefined, undefined, 33),
    /Too many arguments provided. Expected max 1 but received 4./
  );
});

test('supports null as special type', t => {
  t.true(argsert('<null>', null));
});

test('configures function to accept 0 parameters, if only arguments are provided', t => {
  t.throws(
    () => argsert(99),
    /Too many arguments provided. Expected max 0 but received 1./
  );
});

test('allows no config with no arguments provided', t => {
  t.true(argsert());
});

test('allows empty configuration to accept no arguments', t => {
  t.true(argsert(''));
});

test.skip('throws when wildcard is used in optional configuration', t => {
  t.throws(
    () => argsert('[*]', 'bar'),
    /Invalid type config in the first position./
  );
});

test('throws when the optional config has broken syntax', t => {
  t.throws(
    () => argsert('<*> [foo||bar]', 'baz', 'boo'),
    /Invalid type config in the second position./
  );
});

test('throws when required config has broken syntax', t => {
  t.throws(
    () => argsert('[string] <* joker *>', 'baz', 'scarecrow'),
    /Invalid type config in the second position./
  );
});
