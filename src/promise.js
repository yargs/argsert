import argsert from './';

export default function argsertPromise () {
  return new Promise((resolve, reject) => {
    try {
      return resolve(argsert.apply(this, arguments));
    } catch (err) {
      return reject(err);
    }
  });
}
