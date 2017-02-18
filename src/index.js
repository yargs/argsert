const REQUIRED = 'required';
const OPTIONAL = 'optional';

export default function argsert (typeConfig, ...args) {
  if (typeof typeConfig !== 'string' || (!isRequired(typeConfig) && !isOptional(typeConfig))) {
    args = [typeConfig];
    typeConfig = '';
  }

  const types = getTypes(typeConfig);
  const configuredKeys = Object.keys(types);
  const numRequired = configuredKeys.filter(k => REQUIRED in types[k]).length;
  args = compactArgs(args);

  if (args.length < numRequired) {
    throw new Error(`Not enough arguments provided. Expected ${numRequired} but received ${args.length}.`);
  }

  if (args.length > configuredKeys.length) {
    throw new Error(`Too many arguments provided. Expected max ${configuredKeys.length} but received ${args.length}.`);
  }

  args.forEach((arg, index) => {
    const observedType =
      Array.isArray(arg) ? 'array'
        : arg === null ? 'null'
          : arg instanceof Error ? 'error'
            : isPromise(arg) ? 'promise'
              : Buffer.isBuffer(arg) ? 'buffer'
                : typeof arg;

    const typesAtIndex = types[index];
    const errorMessage = invalidArgMessage.bind(this, positionName(index), typesAtIndex, observedType);

    if ((REQUIRED in typesAtIndex) && isMissingFrom(typesAtIndex.required, observedType)) {
      throw new TypeError(errorMessage(REQUIRED));
    }

    if ((OPTIONAL in typesAtIndex) && arg !== undefined && isMissingFrom(typesAtIndex.optional, observedType)) {
      throw new TypeError(errorMessage(OPTIONAL));
    }
  });

  return true;
}

function getTypes (typeConfig) {
  return typeConfig.split(' ').reduce((result, str, index) => {
    if (isOptional(str)) {
      return Object.assign({}, result, {
        [index]: {
          [OPTIONAL]: str.split('|').map(s => s.replace('[', '').replace(']', ''))
        }
      });
    } else if (isRequired(str)) {
      return Object.assign({}, result, {
        [index]: {
          [REQUIRED]: str.split('|').map(s => s.replace('<', '').replace('>', ''))
        }
      });
    } else if (str === '') {
      return result;
    } else {
      throw new Error(`Invalid type config in the ${positionName(index)} position.`);
    }
  }, {});
}

function isMissingFrom (types, observed) {
  return types.indexOf(observed) < 0 && types.indexOf('*') < 0;
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
  return types[kind]
    .concat(kind === OPTIONAL && types[OPTIONAL].indexOf('undefined') < 0 ? 'undefined' : [])
    .join(' or ');
}

function isOptional (arg) {
  return arg.match(/^\[(\w+|\*)((?:\|(\w+))*?)]/);
}

function isRequired (arg) {
  return arg.match(/^<(\w+|\*)((?:\|(\w+))*?)>/);
}

// 'borrowed' from: https://github.com/then/is-promise/commit/ed0eaa4dec17597f0dae892a0472a9b7f459320d
function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
