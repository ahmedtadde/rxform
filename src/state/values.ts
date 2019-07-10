import { throwError } from '@src/utils/errors';
import { I as Icombinator } from '@utils/combinators';
import { log } from '@utils/logger';
import { isFunctionOrPromise, promisifyFunction } from '@utils/object';
import EventEmitter, { Emitter } from 'mitt';
export default (emitter$: Emitter, formValuesOptions: any) => {
  const internalEmitter$: Emitter = new EventEmitter();
  let states = {
    current: getModel(formValuesOptions),
    previous: null
  };

  const helpers = {
    getCurrentState: (statesObj: any) => Object.assign({}, statesObj.current),
    getPreviousState: (statesObj: any) => Object.assign({}, statesObj.previous),
    hooksListeners: getHookListeners(formValuesOptions),
    reducer: getReducer(formValuesOptions)
  };

  internalEmitter$.on('update-states', (newComputedState: any) => {
    states = Object.assign(
      {},
      {
        current: newComputedState,
        previous: states.current
      }
    );
    emitter$.emit(`form@values`, states);
  });

  const listener = (
    currentState: any,
    emitterInstance$: Emitter,
    optionsObj: any,
    helperFnsObj: any
  ) => (newValue: { type: string; value: any | any[] }) =>
    handler(
      currentState,
      newValue,
      Object.assign({}, optionsObj, helperFnsObj, {
        ctxEmitter$: emitterInstance$,
        internalEmitter$
      })
    );

  emitter$.on(
    `form@value`,
    listener(
      helpers.getCurrentState(states),
      emitter$,
      formValuesOptions,
      helpers
    )
  );

  return listener;
};

function handler(
  currentState: any,
  newValue: { type: string; value: any | any[] },
  ctx: any
) {
  log.info('handling form@value event with currentState', currentState);
  promisifyFunction(ctx.hooksListeners.before, {
    currentState,
    newValue
  })
    .then(() => {
      return promisifyFunction(ctx.reducer, currentState, newValue);
    })
    .then((newComputedState: any) => {
      ctx.internalEmitter$.emit('update-states', newComputedState);
      return promisifyFunction(ctx.hooksListeners.after, {
        currentState: newComputedState,
        previousState: currentState
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
