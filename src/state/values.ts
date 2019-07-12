import { I as Icombinator } from '@utils/combinators';
import { throwError } from '@utils/errors';
import { isFunctionOrPromise, promisifyFunction } from '@utils/object';
import { Emitter } from 'mitt';
export default (emitter$: Emitter, formValuesOptions: any) => {
  const helpers = {
    getStates: getStatesGenerator(formValuesOptions),
    hooksListeners: getHookListeners(formValuesOptions),
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

  return listener;
};

function handler(newValue: { type: string; value: any | any[] }, ctx: any) {
  const currentState = ctx.getStates().current;
  promisifyFunction(ctx.hooksListeners.before, {
    currentState,
    newValue
  })
    .then(() => {
      return promisifyFunction(ctx.reducer, currentState, newValue);
    })
    .then((newComputedState: any) => {
      const states = ctx.getStates(newComputedState);
      ctx.emitter$.emit('form@values', states.current);
      return promisifyFunction(ctx.hooksListeners.after, {
        currentState: states.current,
        previousState: states.previous
      });
    })
    .then(() => true)
    .catch((error: Error) => {
      throwError(error);
    });
}

function getModel(options: any) {
  return options.model ? options.model : throwError("Invalid values' model");
}

function getReducer(options: any) {
  return isFunctionOrPromise(options.update.reducer)
    ? options.update.reducer
    : throwError("Invalid values' state reducer");
}

function getHookListeners(options: any) {
  return Object.keys(options.update.hooks).reduce(
    (listeners: any, hook: string) => {
      const listener = isFunctionOrPromise(options.update.hooks[hook])
        ? options.update.hooks[hook]
        : Icombinator;
      return Object.assign({}, listeners, { [hook]: listener });
    },
    {}
  );
}

function getStatesGenerator(options: any) {
  let states = {
    current: getModel(options),
    previous: null
  };

  return (...args: any[]) => {
    if (!args.length) {
      return states;
    }

    states = {
      current: args[0],
      previous: states.current
    };

    return states;
  };
}
