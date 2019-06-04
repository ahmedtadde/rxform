import { throwError } from '@utils/errors';
import { not } from '@utils/logic';
export const isFunction = (x: any): boolean =>
  typeof x === 'function' && x instanceof Function;

export const isPromise = (x: any): boolean => x instanceof Promise;

export const isFunctionOrPromise = (x: any): boolean =>
  isFunction(x) || isPromise(x);

export const promisifyFunction = (fn: any, ...args: any[]) => {
  if (isPromise(fn)) return fn;
  if (not(isFunction(fn))) {
    throwError(`Unable to promisify vale of type ${typeof fn}`);
  }

  return new Promise((resolve, reject) => {
    try {
      resolve(fn(...args));
    } catch (error) {
      reject(error);
    }
  });
};
