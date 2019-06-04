export const toBool = (x: any) => Boolean(x);
export const not = (x: any): boolean => !toBool(x);
export const isUndefined = (x: any): boolean =>
  x === undefined && typeof x === 'undefined';
export const isNull = (x: any): boolean => x === null && typeof x === 'object';
export const isNil = (x: any): boolean => isNull(x) || isUndefined(x);
