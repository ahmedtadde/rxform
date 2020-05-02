import { Predicate } from "@util/types";

export interface None {
  readonly _is: "None";
}

export interface Some<T> {
  readonly _is: "Some";
  readonly value: T;
}

export type Option<T> = None | Some<T>;

export const none: Option<never> = { _is: "None" };

export function some<T>(x: T): Option<T> {
  return { _is: "Some", value: x };
}

export const is = {
  some: <T>(x: Option<T>): x is Some<T> => {
    return x._is === "Some";
  },
  none: <T>(x: Option<T>): x is None => {
    return x._is === "None";
  }
};

export function match<T, N, S>(
  none: () => N,
  some: (y: T) => S
): (x: Option<T>) => N | S {
  return (x): N | S => (is.none(x) ? none() : some(x.value));
}

export function concat<T>(x: Option<T>, y: Option<T>): Option<T> {
  if (is.none(x) && is.none(y)) return none;
  if (is.some(x) && is.some(y)) return y;

  if (is.some(x) && is.none(y)) return x;
  if (is.none(x) && is.some(y)) return y;

  return none;
}

export const from = {
  nullable: <T>(x: T): Option<NonNullable<T>> => {
    const isnull = x === null;
    const isundefined = typeof x === "undefined";
    return isnull || isundefined ? none : some(x as NonNullable<T>);
  },
  nan: <T>(x: T): Option<number> => {
    return isNaN(Number(x)) ? none : some(Number(x));
  },
  falsy: <T>(x: T): Option<T> => {
    return !x ? none : some(x);
  },
  predicate<T>(fn: Predicate<T>): (x: T) => Option<T> {
    return (x): Option<T> => (fn(x) ? some(x) : none);
  }
};
