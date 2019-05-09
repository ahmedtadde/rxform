import R from 'ramda';
export const throwGenericError = (input: any): void => {
  const error: (input: any) => Error = R.ifElse(
    R.is(Error),
    (payload: Error): Error => payload,
    (payload: any): Error => new Error(JSON.stringify(payload))
  );
  throw error(input);
};
