'use strict';

module.exports = function argsert (typeConfig, ...args) {
  if (typeof typeConfig !== 'string' || (!isRequired(typeConfig) && !isOptional(typeConfig))) {
    args = [typeConfig];
    typeConfig = '';
  }

  const types = getTypes(typeConfig);
  const configuredKeys = Object.keys(types);
  const numRequired = configuredKeys.filter(k => 'required' in types[k]).length;
  args = compactArgs(args);

  if (args.length < numRequired) {
    throw new Error(`Not enough arguments provided. Expected ${numRequired} but received ${args.length}.`);
  }

  if (args.length > configuredKeys.length) {
    throw new Error(`Too many arguments provided. Expected max ${configuredKeys.length} but received ${args.length}.`);
  }

  args.forEach((arg, index) => {
    const observedType = Array.isArray(arg) ? 'array'
      : arg === null ? 'null'
        : arg instanceof Error ? 'error'
          : typeof arg;

    const typesAtIndex = types[index];
    const errorMessage = invalidArgMessage.bind(this, positionName(index), typesAtIndex, observedType);

    if ('required' in typesAtIndex) {
      const required = typesAtIndex.required;

      if (required.indexOf(observedType) < 0 && required.indexOf('*') < 0) {
        throw new TypeError(errorMessage('required'));
      }
    }

    if ('optional' in typesAtIndex) {
      const optional = typesAtIndex.optional;

      if (optional.indexOf('*') < 0 && optional.indexOf(observedType) < 0) {
        throw new TypeError(errorMessage('optional'));
      }
    }
  });

  return true;
};

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
    } else if (str === '') {
      return result;
    } else {
      throw new Error(`Invalid type config in the ${positionName(index)} position.`);
    }
  }, {});
}

function compactArgs (args) {
  const lastArg = args[args.length - 1];
  if (lastArg === undefined || lastArg === '') {
    return args.filter(arg => arg !== undefined && arg !== '');
  }
  return args;
}

function invalidArgMessage (position, types, observed, kind) {
  return `Invalid ${position} argument. Expected ${expectedTypes(types, kind)} but received ${observed}.`;
}

function positionName (index) {
  const positionNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  return positionNames[index] || 'manyith';
}

function expectedTypes (types, kind) {
  return types[kind].join(' or ');
}

function isOptional (arg) {
  return arg.match(/^\[(\w+|\*)((?:\|(\w+))*?)]/);
}

function isRequired (arg) {
  return arg.match(/^<(\w+|\*)((?:\|(\w+))*?)>/);
}
