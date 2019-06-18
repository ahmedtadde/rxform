import { not } from '@utils/logic';
export const isNumber = (x: any): boolean =>
  typeof x === 'number' && not(isNaN(x));
