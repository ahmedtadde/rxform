import { I as Icombinator } from '@utils/combinators';
import { throwError } from '@utils/errors';
import { not } from '@utils/logic';
import {
  deepFreeze,
  isFunctionOrPromise,
  isPlainObject,
  promisifyFunction
} from '@utils/object';
import deepmerge from 'deepmerge';
import { Emitter } from 'mitt';
export default (emitter$: Emitter, formValuesOptions: any) => {
  const helpers = {
    getStates: getStatesGenerator(formValuesOptions),
    hookListeners: getHookListeners(formValuesOptions),
    reducer: getReducer(formValuesOptions)
  };

  const listener = (
    emitterInstance$: Emitter,
    optionsObj: any,
    helperFnsObj: any
  ) => (newValue: { type: string; value: any | any[] }) =>
    handler(
      newValue,
      Object.assign({}, optionsObj, helperFnsObj, {
        emitter$: emitterInstance$
      })
    );

  emitter$.on(`form@value`, listener(emitter$, formValuesOptions, helpers));
  emitter$.on(`form@reset`, (payload: any) => {
    const states = helpers.getStates(
      not(payload instanceof Event) && isPlainObject(payload)
        ? payload
        : getInitialState(formValuesOptions)
    );
    emitter$.emit('form@values', deepmerge({}, states.current));
  });

  emitter$.on(`set-values`, (payload: any) => {
    isPlainObject(payload) || throwError("Invalid values' state object");
    const states = helpers.getStates(payload);
    emitter$.emit('form@values', deepmerge({}, states.current));
  });

  return listener;
};

function handler(newValue: { type: string; value: any | any[] }, ctx: any) {
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
        throwError('Invalid state values data; expected plain object');
      const states = ctx.getStates(newComputedState);
      ctx.emitter$.emit('form@values', deepmerge({}, states.current));
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
  return isPlainObject(options.state)
    ? deepFreeze(options.state)
    : throwError("Invalid initial values' state");
}

function getReducer(options: any) {
  return isFunctionOrPromise(options.reducer)
    ? options.reducer
    : throwError("Invalid values' state reducer");
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
    current: getInitialState(options) as Readonly<any>,
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
