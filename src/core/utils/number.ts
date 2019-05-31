import { not } from '@utils/logic';
export const isNumber = (x: any): boolean =>
  not(isNaN(x)) && typeof x === 'number';
