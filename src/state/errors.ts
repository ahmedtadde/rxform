import { I as Icombinator } from "@utils/combinators";
import { throwError } from "@utils/errors";
import { not } from "@utils/logic";
import {
  isFunctionOrPromise,
  isPlainObject,
  promisifyFunction
} from "@utils/object";
import { Emitter } from "mitt";
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
  emitter$.on(`form@reset`, (payload: any) => {
    const states = helpers.getStates(
      not(payload instanceof Event) && isPlainObject(payload) ? payload : {}
    );
    emitter$.emit("form@errors", states.current);
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
      ctx.emitter$.emit("form@errors", states.current);
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
  return isPlainObject(options.state) ? options.state : {};
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
    current: { [key: string]: any };
    previous: { [key: string]: any } | null;
  } = {
    current: getInitialState(options),
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
