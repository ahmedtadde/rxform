import { throwError } from '@utils/errors';
import { not } from '@utils/logic';
import cloneDeep from 'lodash.clonedeep';

export const isBoolean = (x: any): boolean => typeof x === 'boolean';
export const isUndefined = (x: any): boolean =>
  x === undefined && typeof x === 'undefined';
export const isNull = (x: any): boolean => x === null && typeof x === 'object';
export const isNil = (x: any): boolean => isNull(x) || isUndefined(x);
export const isString = (x: any) =>
  typeof x === 'string' || x instanceof String;

export const trim = (str: string, direction?: string) => {
  if (not(isString(str))) {
    throwError('Invalid argument value; value must be a string');
  }

  const directionIsValid =
    typeof direction !== 'undefined' &&
    ['left', 'right', 'both'].includes(direction);

  if (directionIsValid) {
    switch (direction) {
      case 'left':
        return str.trimLeft();
      case 'right':
        return str.trimRight();
      default:
        return str.trimRight();
    }
  }
  return str.trim();
};

export const emptyString = (x: any): boolean => {
  return isString(x) && not(trim(x));
};

export const nonEmptyString = (x: any): boolean => {
  return isString(x) && Boolean(trim(x));
};

export const isNumber = (x: any): boolean =>
  typeof x === 'number' && not(isNaN(x));

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
      `function argument (fn) is invalid; received value of type ${typeof fn}`
    );
  }

  return new Promise((resolve, reject) => {
    try {
      const inputs = args.map((arg: any) => {
        const shouldClone =
          nonPrimitiveType(arg) &&
          not(arg instanceof Element) &&
          not(arg instanceof Event);
        return shouldClone ? deepClone(arg) : arg;
      });
      resolve(fn(...inputs));
    } catch (error) {
      reject(error);
    }
  });
};

export const nonFrozenObject = (obj: any) => not(Object.isFrozen(obj));

export const nonPrimitiveType = (obj: any) =>
  not(isNil(obj)) && (Array.isArray(obj) || isObject(obj) || isFunction(obj));

export const getValueFromObject = (obj: any, path: string): any => {
  const decomposePath = (selectorPath: string) => {
    nonEmptyString(selectorPath) ||
      throwError(
        `Invalid obj path expression: ${JSON.stringify(selectorPath)}`
      );
    return selectorPath.split('.');
  };

  const standardizeObjKey = (step: string) => {
    const regex = new RegExp('[[0-9]+]');
    if (step !== '[]' && regex.test(step)) {
      return Number(step.replace(/\[/g, '').replace(/\]/g, ''));
    }
    return step;
  };

  const decomposedPath = decomposePath(path);

  const getValue = (fromObj: any, key: string) => {
    const standardizedKey: string | number = standardizeObjKey(key);
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

export function deepFreeze(obj: any): Readonly<any> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop: string) => {
    if (
      obj.hasOwnProperty(prop) &&
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });

  return obj as Readonly<any>;
}
export function deepClone(obj: any): Readonly<any> {
  return deepFreeze(cloneDeep(obj));
}
