import { I as Icombinator } from '@utils/combinators';
import { throwError } from '@utils/errors';
import {
  deepFreeze,
  isFunctionOrPromise,
  isPlainObject,
  promisifyFunction
} from '@utils/object';
import deepmerge from 'deepmerge';
import { Emitter } from 'mitt';
export default (emitter$: Emitter, formErrorsOptions: any) => {
  const helpers = {
    getStates: getStatesGenerator(formErrorsOptions),
    hookListeners: getHookListeners(formErrorsOptions),
    reducer: getReducer(formErrorsOptions)
  };

  const listener = (
    emitterInstance$: Emitter,
    optionsObj: any,
    helperFnsObj: any
  ) => (newValue: { type: string; value: any }) =>
    handler(
      newValue,
      Object.assign({}, optionsObj, helperFnsObj, {
        emitter$: emitterInstance$
      })
    );

  emitter$.on(`form@error`, listener(emitter$, formErrorsOptions, helpers));
  emitter$.on(`form@reset`, () => {
    const states = helpers.getStates({});
    emitter$.emit('form@errors', deepmerge({}, states.current));
  });

  emitter$.on(`set-errors`, (payload: any) => {
    isPlainObject(payload) || throwError("Invalid errors' state object");
    const states = helpers.getStates(payload);
    emitter$.emit('form@errors', deepmerge({}, states.current));
  });

  return listener;
};

function handler(newValue: { type: string; value: any }, ctx: any) {
  const currentState = ctx.getStates().current;
  promisifyFunction(ctx.hookListeners.before, {
    currentState,
    newValue
  })
    .then(() => {
      return promisifyFunction(ctx.reducer, currentState, newValue);
    })
    .then((newComputedState: any) => {
      isPlainObject(newComputedState) ||
        throwError("Invalid errors' state data; expected plain object");
      const states = ctx.getStates(newComputedState);
      ctx.emitter$.emit('form@errors', deepmerge({}, states.current));
      return promisifyFunction(ctx.hookListeners.after, {
        currentState: states.current,
        previousState: states.previous
      });
    })
    .then(() => true)
    .catch((error: Error) => {
      throwError(error);
    });
}

function getInitialState(options: any) {
  return deepFreeze(isPlainObject(options.state) ? options.state : {});
}

function getReducer(options: any) {
  return isFunctionOrPromise(options.reducer)
    ? options.reducer
    : throwError("Invalid errors' state reducer");
}

function getHookListeners(options: any) {
  const hooksDeclarationObj = Object.assign(
    {},
    { before: Icombinator, after: Icombinator },
    options.hooks || {}
  );
  return Object.keys(hooksDeclarationObj).reduce(
    (listeners: any, hook: string) => {
      const listener = isFunctionOrPromise(hooksDeclarationObj[hook])
        ? hooksDeclarationObj[hook]
        : Icombinator;
      return Object.assign({}, listeners, { [hook]: listener });
    },
    {}
  );
}

function getStatesGenerator(options?: any) {
  let states: {
    current: Readonly<{ [key: string]: Readonly<any> }>;
    previous: Readonly<{ [key: string]: Readonly<any> } | null>;
  } = {
    current: getInitialState(options),
    previous: null
  };

  return (...args: any[]) => {
    if (!args.length) {
      return states;
    }

    if (isPlainObject(args[0])) {
      states = {
        current: deepFreeze(args[0]),
        previous: states.current
      };
    }

    return states;
  };
}
