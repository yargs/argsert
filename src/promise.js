import argsert from './';

export default function argsertPromise (...args) {
  return new Promise((resolve, reject) => {
    try {
      return resolve(argsert(...args));
    } catch (err) {
      return reject(err);
    }
  });
}
