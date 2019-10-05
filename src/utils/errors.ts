export const throwError = (input: any): void => {
  if (input instanceof Error) {
    throw input;
  } else {
    throw new Error(JSON.stringify(input));
  }
};

export const errorMessage = (error: any) => {
  return error instanceof Error ? error.message : new Error(error).message;
};
