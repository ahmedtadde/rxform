import { throwError } from '@utils/errors';
import { not } from '@utils/logic';

export const isString = (x: any) =>
  typeof x === 'string' || x instanceof String;
export const uppercase = (str: string) => {
  if (not(isString(str))) {
    throwError('Invalid argument value; value must be a string');
  }
  return str.toUpperCase();
};
export const lowercase = (str: string) => {
  if (not(isString(str))) {
    throwError('Invalid argument value; value must be a string');
  }
  return str.toLowerCase();
};
export const startcase = (str: string) => {
  if (not(isString(str))) {
    throwError('Invalid argument value; value must be a string');
  }

  return str;
};
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
