import { throwError } from '@utils/errors';
import { not } from '@utils/logic';
export const isFunction = (x: any): boolean =>
  typeof x === 'function' && x instanceof Function;

export const isPromise = (x: any): boolean => x instanceof Promise;

export const isFunctionOrPromise = (x: any): boolean =>
  isFunction(x) || isPromise(x);

export const promisifyFunction = (fn: any, ...args: any[]) => {
  if (not(isFunction(fn))) {
    throwError(
      `function argument is invalid; received value of type ${typeof fn}`
    );
  }

  return new Promise((resolve, reject) => {
    try {
      resolve(fn(...args));
    } catch (error) {
      reject(error);
    }
  });
};
