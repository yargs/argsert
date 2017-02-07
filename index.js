'use strict';

module.exports = function argsert (typeConfig, ...args) {
  if (typeof typeConfig !== 'string' || (!isRequired(typeConfig) && !isOptional(typeConfig))) {
    throw new Error('A type configuration string for your arguments is required.');
  }

  const types = getTypes(typeConfig);
  const configuredKeys = Object.keys(types);
  const numRequired = configuredKeys.filter(k => 'required' in types[k]).length;
  args = args[args.length - 1] === undefined ? args.filter(v => v !== undefined) : args;

  if (args.length < numRequired) {
    throw new Error(`Not enough arguments provided. Expected ${numRequired} but received ${args.length}.`);
  }

  if (args.length > configuredKeys.length) {
    throw new Error(`Too many arguments provided. Expected max ${configuredKeys.length} but received ${args.length}.`);
  }

  args.forEach((arg, index) => {
    const observedType = Array.isArray(arg) ? 'array' : arg === null ? 'null' : typeof arg;

    if ('required' in types[index]) {
      const required = types[index].required;

      if (required.indexOf(observedType) < 0 && required.indexOf('*') < 0) {
        throw new Error(invalidArgMessage(positionName(index), expectedTypes(types[index], 'required'), observedType));
      }
    } else if ('optional' in types[index]) {
      if (types[index].optional.indexOf(observedType) < 0) {
        throw new Error(invalidArgMessage(positionName(index), expectedTypes(types[index], 'optional'), observedType));
      }
    }
  });

  return true;
};

function invalidArgMessage(position, expected, observed) {
  return `Invalid ${position} argument. Expected ${expected} but received ${observed}.`;
}

function positionName(index) {
  const positionNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  return positionNames[index] || 'manyith';
}

function getTypes (typeConfig) {
  return typeConfig.split(' ').reduce((result, str, index) => {
    if (isOptional(str)) {
      return Object.assign({}, result, {
        [index]: {
          optional: str.split('|').map(s => s.replace('[', '').replace(']', ''))
        }
      });
    } else if (isRequired(str)) {
      return Object.assign({}, result, {
        [index]: {
          required: str.split('|').map(s => s.replace('<', '').replace('>', ''))
        }
      });
    } else {
      throw new Error(`invalid type config at pos: ${index}`);
    }
  }, {});
}

function expectedTypes (types, kind) {
  return types[kind].join(' or ');
}

function isOptional (arg) {
  return arg.match(/^\[(\w+)((?:\|(\w+))*?)]/);
}

function isRequired (arg) {
  return arg.match(/^<(\w+|\*)((?:\|(\w+))*?)>/);
}
