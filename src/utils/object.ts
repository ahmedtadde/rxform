import { throwError } from '@utils/errors';
import { not } from '@utils/logic';
import { isNumber } from '@utils/number';
import { nonEmptyString } from '@utils/string';

export const isObject = (obj: any) => {
  return obj !== null && not(Array.isArray(obj)) && typeof obj === 'object';
};

export const isPlainObject = (obj: any) => {
  return isObject(obj) && obj.constructor.name === 'Object';
};

export const nonEmptyArray = (obj: any) => Array.isArray(obj) && obj.length;

export const isFunction = (obj: any): boolean =>
  typeof obj === 'function' && obj instanceof Function;

export const isPromise = (obj: any): boolean =>
  isObject(obj) && isFunction(obj.then) && obj instanceof Promise;

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

export const getValueFromObject = (obj: any, path: string): any => {
  const getDecomposedPath = (selectorPath: string) => {
    nonEmptyString(selectorPath) ||
      throwError(
        `Invalid obj path expression: ${JSON.stringify(selectorPath)}`
      );
    return selectorPath.split('.');
  };

  const standarizedObjKey = (step: string) => {
    const regex = new RegExp('[[0-9]+]');
    if (step !== '[]' && regex.test(step)) {
      return Number(step.replace(/\[/g, '').replace(/\]/g, ''));
    }
    return step;
  };

  const decomposedPath = getDecomposedPath(path);

  const getValue = (fromObj: any, key: string) => {
    const standardizedKey: string | number = standarizedObjKey(key);
    if (isNumber(standardizedKey)) {
      Array.isArray(fromObj) ||
        throwError('Invalid obj; expected an array to extract value by index');
      return fromObj[standardizedKey];
    } else if (nonEmptyString(standardizedKey)) {
      isPlainObject(fromObj) ||
        throwError(
          'Invalid obj; expected a plain object to extract value using accessor key'
        );

      return fromObj[standardizedKey];
    }
    throwError('Invalid key to extract value from obj');
  };

  if (decomposedPath.length === 1) {
    try {
      return getValue(obj, decomposedPath[0]);
    } catch (error) {
      throwError(error);
    }
  } else if (decomposedPath.length > 1) {
    try {
      return getValueFromObject(
        getValue(obj, decomposedPath[0]),
        decomposedPath.slice(1).join('.')
      );
    } catch (error) {
      throwError(error);
    }
  }

  return obj;
};
